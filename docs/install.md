# Install

`sshpod` is a single static binary. Version 0.1.0 is not tagged yet, so building
from source is the reliable path today; the packaged artifacts below are produced
by the release workflow as soon as the first version tag lands.

## Requirements

On the machine running `sshpod`:

- Rust 1.88 or newer, if you build from source
- OpenSSH client, for SSH providers
- Git, to let sshpod clone a workspace onto a remote host

On the machine where containers run — your laptop for a `local` provider, the
remote host for an `ssh` provider:

- Podman, or another Podman-compatible CLI (configurable per provider)
- Git, if the workspace source is cloned there

sshpod does not provision machines. A remote host must already exist, be
reachable through OpenSSH, and have Podman installed.

## From source

```sh
git clone https://github.com/sshpod/sshpod.git
cd sshpod
cargo install --path . --locked
```

## From crates.io

Publishing to crates.io happens on the first version tag. Once that release is
out:

```sh
cargo install sshpod --locked
```

## Prebuilt binaries

Each release attaches a `sshpod-<version>-<target>.tar.gz` archive for four
targets:

| Platform | Target |
| --- | --- |
| Linux x86-64 | `x86_64-unknown-linux-musl` |
| Linux ARM64 | `aarch64-unknown-linux-musl` |
| macOS Intel | `x86_64-apple-darwin` |
| macOS Apple Silicon | `aarch64-apple-darwin` |

Linux builds are statically linked against musl, so they have no libc
dependency.

```sh
tar -xzf sshpod-<version>-x86_64-unknown-linux-musl.tar.gz
install -m 0755 sshpod-<version>-x86_64-unknown-linux-musl/sshpod ~/.local/bin/sshpod
```

## RPM and DEB packages

Linux releases also attach an `.rpm` and a `.deb`, both installing the binary to
`/usr/bin/sshpod`. The DEB declares no dependencies because the binary is static.

```sh
sudo dnf install ./sshpod-<version>.x86_64.rpm
# or
sudo dpkg -i ./sshpod_<version>_amd64.deb
```

Releases are published from tags on
[github.com/sshpod/sshpod](https://github.com/sshpod/sshpod/releases).

## Verify the installation

```sh
sshpod -V
sshpod --version
sshpod doctor
```

`sshpod -V` prints the package version. `sshpod --version` also includes the
source Git commit when it was available at build time; builds contain no
timestamp.

`sshpod doctor` runs `podman --version` locally and reports it:

```text
Podman CLI: podman version 5.3.1
Local executable check passed. Runtime and remote connectivity were not checked.
```

::: tip
`doctor` only checks the local Podman executable. It does not connect to SSH
providers or verify a remote Podman — a failing SSH provider surfaces on the next
[`up`](/cli#up) instead.
:::

Next: [Quick Start](/quick-start).
