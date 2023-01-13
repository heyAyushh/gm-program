FROM rust:1.66

RUN apt-get update
RUN apt-get upgrade
RUN apt-get install -y \
  curl \
  git \
  gnupg2 \
  jq \
  sudo \
  zsh \
  vim \
  build-essential \
  openssl \
  pkg-config \
  libudev-dev \
  libssl-dev

WORKDIR /usr/src/
COPY . .

## install solana
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.14.12/install)"
RUN export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

## install anchor
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

RUN avm install latest
RUN avm use latest

## setup and install oh-my-zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
RUN cp -R /root/.oh-my-zsh /home/$USERNAME
RUN cp /root/.zshrc /home/$USERNAME
RUN sed -i -e "s/\/root\/.oh-my-zsh/\/home\/$USERNAME\/.oh-my-zsh/g" /home/$USERNAME/.zshrc
RUN chown -R $USER_UID:$USER_GID /home/$USERNAME/.oh-my-zsh /home/$USERNAME/.zshrc