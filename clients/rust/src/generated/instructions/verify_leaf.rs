//! This code was AUTOGENERATED using the kinobi library.
//! Please DO NOT EDIT THIS FILE, instead use visitors
//! to add features, then rerun kinobi to update it.
//!
//! [https://github.com/metaplex-foundation/kinobi]
//!

use borsh::BorshDeserialize;
use borsh::BorshSerialize;

/// Accounts.
pub struct VerifyLeaf {
    pub merkle_tree: solana_program::pubkey::Pubkey,
}

impl VerifyLeaf {
    pub fn instruction(
        &self,
        args: VerifyLeafInstructionArgs,
    ) -> solana_program::instruction::Instruction {
        self.instruction_with_remaining_accounts(args, &[])
    }
    #[allow(clippy::vec_init_then_push)]
    pub fn instruction_with_remaining_accounts(
        &self,
        args: VerifyLeafInstructionArgs,
        remaining_accounts: &[solana_program::instruction::AccountMeta],
    ) -> solana_program::instruction::Instruction {
        let mut accounts = Vec::with_capacity(1 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            self.merkle_tree,
            false,
        ));
        accounts.extend_from_slice(remaining_accounts);
        let mut data = VerifyLeafInstructionData::new().try_to_vec().unwrap();
        let mut args = args.try_to_vec().unwrap();
        data.append(&mut args);

        solana_program::instruction::Instruction {
            program_id: crate::SPL_ACCOUNT_COMPRESSION_ID,
            accounts,
            data,
        }
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
struct VerifyLeafInstructionData {
    discriminator: [u8; 8],
}

impl VerifyLeafInstructionData {
    fn new() -> Self {
        Self {
            discriminator: [124, 220, 22, 223, 104, 10, 250, 224],
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Eq, PartialEq)]
#[cfg_attr(feature = "serde", derive(serde::Serialize, serde::Deserialize))]
pub struct VerifyLeafInstructionArgs {
    pub root: [u8; 32],
    pub leaf: [u8; 32],
    pub index: u32,
}

/// Instruction builder for `VerifyLeaf`.
///
/// ### Accounts:
///
///   0. `[]` merkle_tree
#[derive(Default)]
pub struct VerifyLeafBuilder {
    merkle_tree: Option<solana_program::pubkey::Pubkey>,
    root: Option<[u8; 32]>,
    leaf: Option<[u8; 32]>,
    index: Option<u32>,
    __remaining_accounts: Vec<solana_program::instruction::AccountMeta>,
}

impl VerifyLeafBuilder {
    pub fn new() -> Self {
        Self::default()
    }
    #[inline(always)]
    pub fn merkle_tree(&mut self, merkle_tree: solana_program::pubkey::Pubkey) -> &mut Self {
        self.merkle_tree = Some(merkle_tree);
        self
    }
    #[inline(always)]
    pub fn root(&mut self, root: [u8; 32]) -> &mut Self {
        self.root = Some(root);
        self
    }
    #[inline(always)]
    pub fn leaf(&mut self, leaf: [u8; 32]) -> &mut Self {
        self.leaf = Some(leaf);
        self
    }
    #[inline(always)]
    pub fn index(&mut self, index: u32) -> &mut Self {
        self.index = Some(index);
        self
    }
    /// Add an aditional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: solana_program::instruction::AccountMeta,
    ) -> &mut Self {
        self.__remaining_accounts.push(account);
        self
    }
    /// Add additional accounts to the instruction.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[solana_program::instruction::AccountMeta],
    ) -> &mut Self {
        self.__remaining_accounts.extend_from_slice(accounts);
        self
    }
    #[allow(clippy::clone_on_copy)]
    pub fn instruction(&self) -> solana_program::instruction::Instruction {
        let accounts = VerifyLeaf {
            merkle_tree: self.merkle_tree.expect("merkle_tree is not set"),
        };
        let args = VerifyLeafInstructionArgs {
            root: self.root.clone().expect("root is not set"),
            leaf: self.leaf.clone().expect("leaf is not set"),
            index: self.index.clone().expect("index is not set"),
        };

        accounts.instruction_with_remaining_accounts(args, &self.__remaining_accounts)
    }
}

/// `verify_leaf` CPI accounts.
pub struct VerifyLeafCpiAccounts<'a, 'b> {
    pub merkle_tree: &'b solana_program::account_info::AccountInfo<'a>,
}

/// `verify_leaf` CPI instruction.
pub struct VerifyLeafCpi<'a, 'b> {
    /// The program to invoke.
    pub __program: &'b solana_program::account_info::AccountInfo<'a>,

    pub merkle_tree: &'b solana_program::account_info::AccountInfo<'a>,
    /// The arguments for the instruction.
    pub __args: VerifyLeafInstructionArgs,
}

impl<'a, 'b> VerifyLeafCpi<'a, 'b> {
    pub fn new(
        program: &'b solana_program::account_info::AccountInfo<'a>,
        accounts: VerifyLeafCpiAccounts<'a, 'b>,
        args: VerifyLeafInstructionArgs,
    ) -> Self {
        Self {
            __program: program,
            merkle_tree: accounts.merkle_tree,
            __args: args,
        }
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], &[])
    }
    #[inline(always)]
    pub fn invoke_with_remaining_accounts(
        &self,
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(&[], remaining_accounts)
    }
    #[inline(always)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed_with_remaining_accounts(signers_seeds, &[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed_with_remaining_accounts(
        &self,
        signers_seeds: &[&[&[u8]]],
        remaining_accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> solana_program::entrypoint::ProgramResult {
        let mut accounts = Vec::with_capacity(1 + remaining_accounts.len());
        accounts.push(solana_program::instruction::AccountMeta::new_readonly(
            *self.merkle_tree.key,
            false,
        ));
        remaining_accounts.iter().for_each(|remaining_account| {
            accounts.push(solana_program::instruction::AccountMeta {
                pubkey: *remaining_account.0.key,
                is_signer: remaining_account.1,
                is_writable: remaining_account.2,
            })
        });
        let mut data = VerifyLeafInstructionData::new().try_to_vec().unwrap();
        let mut args = self.__args.try_to_vec().unwrap();
        data.append(&mut args);

        let instruction = solana_program::instruction::Instruction {
            program_id: crate::SPL_ACCOUNT_COMPRESSION_ID,
            accounts,
            data,
        };
        let mut account_infos = Vec::with_capacity(1 + 1 + remaining_accounts.len());
        account_infos.push(self.__program.clone());
        account_infos.push(self.merkle_tree.clone());
        remaining_accounts
            .iter()
            .for_each(|remaining_account| account_infos.push(remaining_account.0.clone()));

        if signers_seeds.is_empty() {
            solana_program::program::invoke(&instruction, &account_infos)
        } else {
            solana_program::program::invoke_signed(&instruction, &account_infos, signers_seeds)
        }
    }
}

/// Instruction builder for `VerifyLeaf` via CPI.
///
/// ### Accounts:
///
///   0. `[]` merkle_tree
pub struct VerifyLeafCpiBuilder<'a, 'b> {
    instruction: Box<VerifyLeafCpiBuilderInstruction<'a, 'b>>,
}

impl<'a, 'b> VerifyLeafCpiBuilder<'a, 'b> {
    pub fn new(program: &'b solana_program::account_info::AccountInfo<'a>) -> Self {
        let instruction = Box::new(VerifyLeafCpiBuilderInstruction {
            __program: program,
            merkle_tree: None,
            root: None,
            leaf: None,
            index: None,
            __remaining_accounts: Vec::new(),
        });
        Self { instruction }
    }
    #[inline(always)]
    pub fn merkle_tree(
        &mut self,
        merkle_tree: &'b solana_program::account_info::AccountInfo<'a>,
    ) -> &mut Self {
        self.instruction.merkle_tree = Some(merkle_tree);
        self
    }
    #[inline(always)]
    pub fn root(&mut self, root: [u8; 32]) -> &mut Self {
        self.instruction.root = Some(root);
        self
    }
    #[inline(always)]
    pub fn leaf(&mut self, leaf: [u8; 32]) -> &mut Self {
        self.instruction.leaf = Some(leaf);
        self
    }
    #[inline(always)]
    pub fn index(&mut self, index: u32) -> &mut Self {
        self.instruction.index = Some(index);
        self
    }
    /// Add an additional account to the instruction.
    #[inline(always)]
    pub fn add_remaining_account(
        &mut self,
        account: &'b solana_program::account_info::AccountInfo<'a>,
        is_writable: bool,
        is_signer: bool,
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .push((account, is_writable, is_signer));
        self
    }
    /// Add additional accounts to the instruction.
    ///
    /// Each account is represented by a tuple of the `AccountInfo`, a `bool` indicating whether the account is writable or not,
    /// and a `bool` indicating whether the account is a signer or not.
    #[inline(always)]
    pub fn add_remaining_accounts(
        &mut self,
        accounts: &[(
            &'b solana_program::account_info::AccountInfo<'a>,
            bool,
            bool,
        )],
    ) -> &mut Self {
        self.instruction
            .__remaining_accounts
            .extend_from_slice(accounts);
        self
    }
    #[inline(always)]
    pub fn invoke(&self) -> solana_program::entrypoint::ProgramResult {
        self.invoke_signed(&[])
    }
    #[allow(clippy::clone_on_copy)]
    #[allow(clippy::vec_init_then_push)]
    pub fn invoke_signed(
        &self,
        signers_seeds: &[&[&[u8]]],
    ) -> solana_program::entrypoint::ProgramResult {
        let args = VerifyLeafInstructionArgs {
            root: self.instruction.root.clone().expect("root is not set"),
            leaf: self.instruction.leaf.clone().expect("leaf is not set"),
            index: self.instruction.index.clone().expect("index is not set"),
        };
        let instruction = VerifyLeafCpi {
            __program: self.instruction.__program,

            merkle_tree: self
                .instruction
                .merkle_tree
                .expect("merkle_tree is not set"),
            __args: args,
        };
        instruction.invoke_signed_with_remaining_accounts(
            signers_seeds,
            &self.instruction.__remaining_accounts,
        )
    }
}

struct VerifyLeafCpiBuilderInstruction<'a, 'b> {
    __program: &'b solana_program::account_info::AccountInfo<'a>,
    merkle_tree: Option<&'b solana_program::account_info::AccountInfo<'a>>,
    root: Option<[u8; 32]>,
    leaf: Option<[u8; 32]>,
    index: Option<u32>,
    /// Additional instruction accounts `(AccountInfo, is_writable, is_signer)`.
    __remaining_accounts: Vec<(
        &'b solana_program::account_info::AccountInfo<'a>,
        bool,
        bool,
    )>,
}
