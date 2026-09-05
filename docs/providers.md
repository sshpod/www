# Providers

A provider is an execution target: where Podman runs. sshpod supports exactly two
kinds, `local` and `ssh`. Providers are stored in the
[configuration file](/config) and referenced by name.

## Local providers

```sh
sshpod provider add local --type local
```

A local provider runs `podman` directly on your machine. `--podman <command>`
overrides the executable when you use a Podman-compatible CLI or a non-default
path:

```sh
sshpod provider add local --type local --podman /usr/local/bin/podman
```

## SSH providers

```sh
sshpod provider add sandbox --type ssh --host sandbox
```

`--host` is required for an SSH provider and is handed to the system OpenSSH
client, so it can be a hostname, a `user@host`, or an alias defined in
`~/.ssh/config`:

```sh
sshpod provider add infra-vm --type ssh --host devops@infra.example.net --ssh-arg -A
```

`--ssh-arg` may be repeated and accepts leading hyphens; each value is stored and
passed through to `ssh`. Everything else — identities, proxy jumps, port
overrides, multiplexing — belongs in `~/.ssh/config`. sshpod does not implement
SSH and does not duplicate its configuration.

Host values are validated to letters, digits, `.`, `_`, `-`, and `@`, and may not
begin with a hyphen.

## Listing providers

```sh
sshpod provider list
```

```text
NAME      TYPE    HOST                        PODMAN   DEFAULT
local     local   -                           podman   yes
sandbox   ssh     sandbox                     podman   -
infra-vm  ssh     devops@infra.example.net    podman   -
```

Columns are tab-separated. `-` means the field does not apply or the provider is
not the default.

## Deleting a provider

```sh
sshpod provider delete sandbox
```

```text
Deleted provider "sandbox"; existing containers and source directories were not deleted
```

Deleting a provider also removes its workspace targets and prunes workspaces that
no longer have any target. It does not stop or remove containers, and it does not
touch source directories — local or remote. The provider named by
`defaultProvider` cannot be deleted.

## Naming rules

Provider and workspace names must be 1–48 characters of lowercase letters,
digits, `.`, `_`, or `-`, and must start with a letter or digit. The same string
is reused in the container name, so a workspace `myproject` on provider `local`
always maps to the container `sshpod-myproject-local`.

## Selecting a provider

A workspace can have several provider targets. With one target, sshpod selects it
automatically. With several, an interactive terminal prompts:

```text
1) local
2) sandbox
Select provider [1/2]:
```

Non-interactive callers must pass `--provider` so scripts stay deterministic:

```sh
sshpod up myproject --provider sandbox
```

## How a remote workspace is materialized

On an SSH provider, sshpod reads `remote.origin.url` from the local Git checkout
and clones it on the remote host into a predictable directory under
`.local/share/sshpod/workspaces/`. If that directory already contains a Git
checkout it is reused instead of cloned again.

A remote target can also point at an existing absolute path on the remote host —
see [workspace targets](/config#workspaces). Synchronizing a local directory to a
remote host is not supported yet.

## Failure modes

Host and Podman commands on an SSH provider are executed through `ssh`, and two
failures are reported specifically:

| Symptom | Meaning |
| --- | --- |
| `provider "sandbox" is unreachable` | `ssh` exited 255 — the host, network, or credentials are the problem, not sshpod |
| Podman missing on that provider | The remote shell reported exit 127 or `podman: not found` |

An unreachable provider also shows up as `unreachable` in
[`sshpod list`](/cli#list) rather than failing the whole listing.
