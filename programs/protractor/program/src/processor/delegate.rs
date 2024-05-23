use anchor_lang::prelude::*;
use spl_account_compression::{program::SplAccountCompression, wrap_application_data_v1, Noop};

use crate::{
    state::{leaf_schema::LeafSchema, TreeConfig},
    utils::{get_asset_id, replace_leaf},
};

#[derive(Accounts)]
pub struct Delegate<'info> {
    #[account(
        seeds = [merkle_tree.key().as_ref()],
        bump,
    )]
    /// CHECK: This account is neither written to nor read from.
    pub tree_authority: Account<'info, TreeConfig>,
    pub leaf_owner: Signer<'info>,
    /// CHECK: This account is neither written to nor read from.
    pub previous_leaf_delegate: UncheckedAccount<'info>,
    /// CHECK: This account is neither written to nor read from.
    pub new_leaf_delegate: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: This account is modified in the downstream program
    pub merkle_tree: UncheckedAccount<'info>,
    pub log_wrapper: Program<'info, Noop>,
    pub compression_program: Program<'info, SplAccountCompression>,
    pub system_program: Program<'info, System>,
}

pub(crate) fn delegate<'info>(
    ctx: Context<'_, '_, '_, 'info, Delegate<'info>>,
    root: [u8; 32],
    data_hash: [u8; 32],
    creator_hash: [u8; 32],
    nonce: u64,
    index: u32,
) -> Result<()> {
    let merkle_tree = ctx.accounts.merkle_tree.to_account_info();
    let owner = ctx.accounts.leaf_owner.key();
    let previous_delegate = ctx.accounts.previous_leaf_delegate.key();
    let new_delegate = ctx.accounts.new_leaf_delegate.key();
    let asset_id = get_asset_id(&merkle_tree.key(), nonce);
    let previous_leaf = LeafSchema::new_v0(
        asset_id,
        owner,
        previous_delegate,
        nonce,
        data_hash,
        creator_hash,
    );
    let new_leaf = LeafSchema::new_v0(
        asset_id,
        owner,
        new_delegate,
        nonce,
        data_hash,
        creator_hash,
    );

    wrap_application_data_v1(new_leaf.to_event().try_to_vec()?, &ctx.accounts.log_wrapper)?;

    replace_leaf(
        &merkle_tree.key(),
        *ctx.bumps.get("tree_authority").unwrap(),
        &ctx.accounts.compression_program.to_account_info(),
        &ctx.accounts.tree_authority.to_account_info(),
        &ctx.accounts.merkle_tree.to_account_info(),
        &ctx.accounts.log_wrapper.to_account_info(),
        ctx.remaining_accounts,
        root,
        previous_leaf.to_node(),
        new_leaf.to_node(),
        index,
    )
}
