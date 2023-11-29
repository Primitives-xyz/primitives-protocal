use anchor_lang::{self, InstructionData, ToAccountMetas};
use solana_program::pubkey::Pubkey;
use solana_program_test::BanksClient;
use solana_sdk::{instruction::AccountMeta, signature::Keypair, transaction::Transaction};

use super::{clone_keypair, instruction, tree::Tree, Error, LeafArgs, Result};

// Helper object to execute and easily alter characteristics of transactions
// which contain a Bubblegum instruction. There's one instantiation for each
// particular operation (when T and U become concrete types), which are
// aliased a bit further below for convenience. The point of these objects
// is to be easy to set up for the common case of each operation, but at the
// same time easy to tweak via the pub fields and methods (including ones that
// can be added) such that it's easy to validate various test cases.
pub struct TxBuilder<'a, T, U, V, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> {
    // This is the accounts structure that holds all the pubkeys, and for
    // each particular op we'll use the one generated by Anchor.
    pub accounts: T,
    pub additional_accounts: Vec<AccountMeta>,
    // Similar to the above, but for instruction data.
    pub data: U,
    // The currently configured payer for the tx.
    pub payer: Pubkey,
    pub client: BanksClient,
    // Currently configured signers for the tx. Using only `Keypair`s as
    // signers for now; can make this more generic if needed.
    pub signers: Vec<Keypair>,
    pub tree: &'a mut Tree<MAX_DEPTH, MAX_BUFFER_SIZE>,
    // When some, indicates that a proof for the specified leaf index should
    // be computed from the inner tree and attached in the form of additional
    // accounts (but only if `self.additional_accounts.len() == 0`, so we
    // dont override a sequence of additional accounts explicitly set for
    // testing purposes).
    pub need_proof: Option<u32>,
    // This member holds data of a custom type that can be specific to each kind
    // of transaction.
    pub inner: V,
}

pub trait OnSuccessfulTxExec {
    fn on_successful_execute(&mut self) -> Result<()>;
}

impl<'a, T, U, V, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize>
    TxBuilder<'a, T, U, V, MAX_DEPTH, MAX_BUFFER_SIZE>
where
    T: ToAccountMetas,
    U: InstructionData,
{
    pub async fn execute(&mut self) -> Result<()>
    where
        Self: OnSuccessfulTxExec,
    {
        let recent_blockhash = self
            .client
            .get_latest_blockhash()
            .await
            .map_err(Error::BanksClient)?;

        let mut ix = instruction(&self.accounts, &self.data);

        if self.additional_accounts.is_empty() {
            // We're only automatically adding the proof if there are no additional
            // accounts explicitly configured.
            if let Some(leaf_idx) = self.need_proof {
                ix.accounts
                    .append(&mut self.tree.proof_of_leaf_metas(leaf_idx))
            }
        } else {
            // Add the additional accounts metas (if any).
            ix.accounts.append(&mut self.additional_accounts.clone());
        }

        let mut tx = Transaction::new_with_payer(&[ix], Some(&self.payer));

        // Using `try_partial_sign` to avoid panics (and get an error when something is
        // wrong instead) no matter what signers are configured.
        tx.try_partial_sign(&self.signers.iter().collect::<Vec<_>>(), recent_blockhash)
            .map_err(Error::Signer)?;

        self.client
            .process_transaction(tx)
            .await
            .map_err(Error::BanksClient)?;

        self.on_successful_execute()?;

        // Check the expected tree root matches on-chain state post tx.
        self.tree.check_expected_root().await
    }

    // Returning `&mut Self` to allow method chaining.
    pub fn set_signers(&mut self, signers: &[&Keypair]) -> &mut Self {
        self.signers = signers.iter().map(|k| clone_keypair(k)).collect();
        self
    }

    pub fn set_payer(&mut self, key: Pubkey) -> &mut Self {
        self.payer = key;
        self
    }

    pub fn set_additional_account_metas(&mut self, metas: &[AccountMeta]) -> &mut Self {
        self.additional_accounts = metas.to_vec();
        self
    }

    // Populate the `additional_account` member with read-only and non-signer accounts based
    // on the provided public keys.
    pub fn set_additional_accounts(&mut self, keys: &[Pubkey]) -> &mut Self {
        self.additional_accounts = keys
            .iter()
            .map(|key| AccountMeta::new_readonly(*key, false))
            .collect();
        self
    }

    pub fn set_additional_accounts_from_arrays(&mut self, keys: &[[u8; 32]]) -> &mut Self {
        self.set_additional_accounts(
            keys.iter()
                .copied()
                .map(Pubkey::new_from_array)
                .collect::<Vec<_>>()
                .as_slice(),
        )
    }
}

// The types below have "builder" in their names because we're essentially
// implementing a lightweight builder patter to instantiate, customize, and
// execute transactions.
pub type CreateBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::CreateTree,
    bubblegum::instruction::CreateTree,
    (),
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for CreateBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        // Do nothing here.
        Ok(())
    }
}

pub type MintV1Builder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::MintV1,
    bubblegum::instruction::MintV1,
    &'a mut LeafArgs,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for MintV1Builder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        // Set the index and nonce for the leaf. We're effectively using `self.num_minted` as
        // the next index to simplify things. Just panic if the conversion fails, as it normally
        // shouldn't during the tests.
        self.inner.index = u32::try_from(self.tree.num_minted()).unwrap();
        self.inner.nonce = self.tree.num_minted();
        self.tree.inc_num_minted();
        self.tree.update_leaf(self.inner)
    }
}

pub type MintToCollectionV1Builder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> =
    TxBuilder<
        'a,
        bubblegum::accounts::MintToCollectionV1,
        bubblegum::instruction::MintToCollectionV1,
        &'a mut LeafArgs,
        MAX_DEPTH,
        MAX_BUFFER_SIZE,
    >;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for MintToCollectionV1Builder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        // Set the index and nonce for the leaf. We're effectively using `self.num_minted` as
        // the next index to simplify things. Just panic if the conversion fails, as it normally
        // shouldn't during the tests.
        self.inner.index = u32::try_from(self.tree.num_minted()).unwrap();
        self.inner.nonce = self.tree.num_minted();
        self.tree.inc_num_minted();

        // Update the collection verified flag.
        let collection = self.inner.metadata.collection.as_mut().unwrap();
        collection.verified = true;

        self.tree.update_leaf(self.inner)
    }
}

pub type BurnBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::Burn,
    bubblegum::instruction::Burn,
    &'a LeafArgs,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for BurnBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        self.tree.zero_leaf(self.inner.index)
    }
}

pub struct TransferInner<'a> {
    pub args: &'a mut LeafArgs,
    pub new_owner: Keypair,
}

pub type TransferBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::Transfer,
    bubblegum::instruction::Transfer,
    TransferInner<'a>,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for TransferBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        // After transfer, the new owner is also the new delegate IIUC.
        self.inner.args.owner = clone_keypair(&self.inner.new_owner);
        self.inner.args.delegate = clone_keypair(&self.inner.new_owner);
        self.tree.update_leaf(self.inner.args)
    }
}

pub struct DelegateInner<'a> {
    pub args: &'a mut LeafArgs,
    pub new_delegate: Keypair,
}

pub type DelegateBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::Delegate,
    bubblegum::instruction::Delegate,
    DelegateInner<'a>,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for DelegateBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        self.inner.args.delegate = clone_keypair(&self.inner.new_delegate);
        self.tree.update_leaf(self.inner.args)
    }
}

pub type RedeemBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::Redeem,
    bubblegum::instruction::Redeem,
    &'a LeafArgs,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for RedeemBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        self.tree.zero_leaf(self.inner.index)
    }
}

pub type CancelRedeemBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::CancelRedeem,
    bubblegum::instruction::CancelRedeem,
    &'a LeafArgs,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for CancelRedeemBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        self.tree.update_leaf(self.inner)
    }
}

pub type SetTreeDelegateBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> =
    TxBuilder<
        'a,
        bubblegum::accounts::SetTreeDelegate,
        bubblegum::instruction::SetTreeDelegate,
        Keypair,
        MAX_DEPTH,
        MAX_BUFFER_SIZE,
    >;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for SetTreeDelegateBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        self.tree.tree_delegate = clone_keypair(&self.inner);
        Ok(())
    }
}

pub struct CreatorVerificationInner<'a> {
    pub args: &'a mut LeafArgs,
    pub creator_key: Pubkey,
}

pub type VerifyCreatorBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::CreatorVerification,
    bubblegum::instruction::VerifyCreator,
    CreatorVerificationInner<'a>,
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for VerifyCreatorBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        for creator in self.inner.args.metadata.creators.iter_mut() {
            if creator.address == self.inner.creator_key {
                creator.verified = true;
                break;
            }
        }
        self.tree.update_leaf(self.inner.args)
    }
}

pub type UnverifyCreatorBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> =
    TxBuilder<
        'a,
        bubblegum::accounts::CreatorVerification,
        bubblegum::instruction::UnverifyCreator,
        CreatorVerificationInner<'a>,
        MAX_DEPTH,
        MAX_BUFFER_SIZE,
    >;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for UnverifyCreatorBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        for creator in self.inner.args.metadata.creators.iter_mut() {
            if creator.address == self.inner.creator_key {
                creator.verified = false;
                break;
            }
        }
        self.tree.update_leaf(self.inner.args)
    }
}

pub type DecompressV1Builder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> = TxBuilder<
    'a,
    bubblegum::accounts::DecompressV1,
    bubblegum::instruction::DecompressV1,
    (),
    MAX_DEPTH,
    MAX_BUFFER_SIZE,
>;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for DecompressV1Builder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        Ok(())
    }
}

pub type SetDecompressibleStateBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> =
    TxBuilder<
        'a,
        bubblegum::accounts::SetDecompressibleState,
        bubblegum::instruction::SetDecompressibleState,
        (),
        MAX_DEPTH,
        MAX_BUFFER_SIZE,
    >;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for SetDecompressibleStateBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        Ok(())
    }
}

#[derive(Debug)]
pub struct CollectionVerificationInner<'a> {
    pub args: &'a mut LeafArgs,
    pub collection_authority: Pubkey,
    pub collection_mint: Pubkey,
    pub collection_metadata: Pubkey,
    pub edition_account: Pubkey,
}

pub type VerifyCollectionBuilder<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> =
    TxBuilder<
        'a,
        bubblegum::accounts::CollectionVerification,
        bubblegum::instruction::VerifyCollection,
        CollectionVerificationInner<'a>,
        MAX_DEPTH,
        MAX_BUFFER_SIZE,
    >;

impl<'a, const MAX_DEPTH: usize, const MAX_BUFFER_SIZE: usize> OnSuccessfulTxExec
    for VerifyCollectionBuilder<'a, MAX_DEPTH, MAX_BUFFER_SIZE>
{
    fn on_successful_execute(&mut self) -> Result<()> {
        let collection = self.inner.args.metadata.collection.as_mut().unwrap();
        collection.verified = true;
        self.tree.update_leaf(self.inner.args)
    }
}
