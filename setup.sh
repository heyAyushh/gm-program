if ! command -v rustc &> /dev/null
then
    echo "rust not installed"
fi

if ! command -v solana &> /dev/null
then
    echo "solana could not be found! Installing 🏓"
    sh -c "$(curl -sSfL https://release.solana.com/v1.10.32/install)"
fi

if ! command -v anchor &> /dev/null
then
    echo "anchor could not be found! Installing 🏓"
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi