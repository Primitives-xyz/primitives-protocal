solana-program-deploy
Deploy an upgradeable program

USAGE:
solana program deploy [FLAGS] [OPTIONS] [PROGRAM_FILEPATH]

FLAGS:
--allow-excessive-deploy-account-balance
Use the designated program id even if the account already holds a large balance of SOL

        --final                                     The program will not be upgradeable
    -h, --help                                      Prints help information
        --no-address-labels                         Do not use address labels in the output
        --skip-seed-phrase-validation
            Skip validation of seed phrases. Use this if your phrase does not use the BIP39 official English word list

        --use-quic                                  Use QUIC when sending transactions.
        --use-rpc
            Send write transactions to the configured RPC instead of validator TPUs

        --use-udp                                   Use UDP when sending transactions.
    -V, --version                                   Prints version information
    -v, --verbose                                   Show additional information

OPTIONS:
--buffer <BUFFER_SIGNER>
Intermediate buffer account to write data to, which can be used to resume a failed deploy [default: random
address]
--commitment <COMMITMENT_LEVEL>
Return information at the selected commitment level [possible values: processed, confirmed, finalized]

        --with-compute-unit-price <COMPUTE-UNIT-PRICE>
            Set compute unit price for transaction, in increments of 0.000001 lamports per compute unit.

    -C, --config <FILEPATH>
            Configuration file to use [default: /Users/noxford/.config/solana/cli/config.yml]

        --fee-payer <KEYPAIR>
            Specify the fee-payer account. This may be a keypair file, the ASK keyword
            or the pubkey of an offline signer, provided an appropriate --signer argument
            is also passed. Defaults to the client keypair.
    -u, --url <URL_OR_MONIKER>
            URL for Solana's JSON RPC or moniker (or their first letter): [mainnet-beta, testnet, devnet, localhost]

    -k, --keypair <KEYPAIR>                               Filepath or URL to a keypair
        --max-len <max_len>
            Maximum length of the upgradeable program [default: the length of the original deployed program]

        --max-sign-attempts <max_sign_attempts>
            Maximum number of attempts to sign or resign transactions after blockhash expiration. If any transactions
            sent during the program deploy are still unconfirmed after the initially chosen recent blockhash expires,
            those transactions will be resigned with a new recent blockhash and resent. Use this setting to adjust the
            maximum number of transaction signing iterations. Each blockhash is valid for about 60 seconds, which means
            using the default value of 5 will lead to sending transactions for at least 5 minutes or until all
            transactions are confirmed,whichever comes first. [default: 5]
        --output <FORMAT>
            Return information in specified output format [possible values: json, json-compact]

        --program-id <PROGRAM_ID>
            Executable program; must be a signer for initial deploys, can be an address for upgrades [default: address
            of keypair at /path/to/program-keypair.json if present, otherwise a random address]. Address is one of:
              * a base58-encoded public key
              * a path to a keypair file
              * a hyphen; signals a JSON-encoded keypair on stdin
              * the 'ASK' keyword; to recover a keypair via its seed phrase
              * a hardware wallet keypair URL (i.e. usb://ledger)
        --upgrade-authority <UPGRADE_AUTHORITY_SIGNER>    Upgrade authority [default: the default configured keypair]
        --ws <URL>                                        WebSocket URL for the solana cluster

ARGS:
<PROGRAM_FILEPATH> /path/to/program.so

tweet example:
Alright, I've been deploying programs on multiple RPC providers under 30s now

If you haven't been able to deploy your program, here's the CLI flags:

solana program deploy target/deploy/deployment.so --with-compute-unit-price <OVER_MEDIAN> --use-rpc --max-sign-attempts 1000
