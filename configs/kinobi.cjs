const path = require("path");
const k = require("@metaplex-foundation/kinobi");

// Paths.
const clientDir = path.join(__dirname, "..", "clients");
const idlDir = path.join(__dirname, "..", "idls");

// Instanciate Kinobi.
const kinobi = k.createFromIdls([
  path.join(idlDir, "bubblegum.json"),
  path.join(idlDir, "spl_account_compression.json"),
  path.join(idlDir, "spl_noop.json"),
]);

// Update programs.
kinobi.update(
  new k.UpdateProgramsVisitor({
    bubblegum: { name: "mplBubblegum" },
  })
);

// Update accounts.
kinobi.update(
  new k.UpdateAccountsVisitor({
    treeConfig: {
      seeds: [k.publicKeySeed("merkleTree")],
      size: 96,
    },
  })
);

// Update types.
kinobi.update(
  new k.UpdateDefinedTypesVisitor({
    // Remove unnecessary spl_account_compression type.
    ApplicationDataEventV1: { delete: true },
    ChangeLogEventV1: { delete: true },
    ConcurrentMerkleTreeHeader: { delete: true },
    ConcurrentMerkleTreeHeaderDataV1: { delete: true },
    PathNode: { delete: true },
    ApplicationDataEvent: { delete: true },
    ChangeLogEvent: { delete: true },
    AccountCompressionEvent: { delete: true },
    CompressionAccountType: { delete: true },
    ConcurrentMerkleTreeHeaderData: { delete: true },
  })
);

// Set default account values accross multiple instructions.
kinobi.update(
  new k.SetInstructionAccountDefaultValuesVisitor([
    {
      account: "logWrapper",
      ignoreIfOptional: true,
      ...k.programDefault(
        "splNoop",
        "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
      ),
    },
    {
      account: "compressionProgram",
      ignoreIfOptional: true,
      ...k.programDefault(
        "splAccountCompression",
        "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK"
      ),
    },
    {
      account: "treeCreator",
      ignoreIfOptional: true,
      ...k.identityDefault(),
    },
    {
      account: "treeAuthority",
      ignoreIfOptional: true,
      ...k.pdaDefault("treeConfig"),
    },
  ])
);

// Update instructions.
kinobi.update(
  new k.UpdateInstructionsVisitor({
    createTree: {
      name: "createTreeConfig",
      bytesCreatedOnChain: k.bytesFromAccount("treeConfig"),
    },
    mintV1: {
      accounts: {
        leafDelegate: { defaultsTo: k.accountDefault("leafOwner") },
        treeDelegate: {
          name: "treeCreatorOrDelegate",
          defaultsTo: k.identityDefault(),
        },
      },
    },
    decompressV1: {
      args: {
        metadata: { name: "message" },
      },
    },
    // Remove unnecessary spl_account_compression instructions.
    append: { delete: true },
    closeEmptyTree: { delete: true },
    compress: { delete: true },
    initEmptyMerkleTree: { delete: true },
    insertOrAppend: { delete: true },
    noopInstruction: { delete: true },
    replaceLeaf: { delete: true },
    transferAuthority: { delete: true },
  })
);

// Set default values for structs.
kinobi.update(
  new k.SetStructDefaultValuesVisitor({
    createTreeConfigInstructionData: {
      public: k.vNone(),
    },
    metadataArgs: {
      symbol: k.vScalar(""),
      primarySaleHappened: k.vScalar(false),
      isMutable: k.vScalar(true),
      editionNonce: k.vNone(),
      tokenStandard: k.vSome(k.vEnum("TokenStandard", "NonFungible")),
      uses: k.vNone(),
      tokenProgramVersion: k.vEnum("TokenProgramVersion", "Original"),
    },
  })
);

// Render JavaScript.
const jsDir = path.join(clientDir, "js", "src", "generated");
const prettier = require(path.join(clientDir, "js", ".prettierrc.json"));
kinobi.accept(new k.RenderJavaScriptVisitor(jsDir, { prettier }));
