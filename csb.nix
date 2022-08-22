with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "rust";
    buildInputs = [
        openssl
        libudev-zero
        vscode-extensions.matklad.rust-analyzer
    ];
    nativeBuildInputs = [
        rustup
        pkg-config
    ];
    # installPhase = ''
    #     rustup default stable
    #     sh -c "$(curl -sSfl https://release.solana.com/v1.10.32/install)"
    #  '';
    shellHook = ''
         export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$HOME/.avm/bin:$PATH"
    '';
}
