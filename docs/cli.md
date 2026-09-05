# CLI reference

```text
sshpod [list]
sshpod up <workspace> [--provider <name>] [--config <path>]
sshpod down <workspace> [--provider <name>]
sshpod provider list
sshpod provider add <name> --type local [--podman <command>]
sshpod provider add <name> --type ssh --host <ssh-config-host> [--podman <command>] [--ssh-arg <arg>]...
sshpod provider delete <name>
sshpod doctor
```

The command surface is intentionally small. `sshpod` with no subcommand is
equivalent to `sshpod list`; an unknown subcommand is an error.

## `list`

List configured workspaces and their status.

```sh
sshpod list
sshpod          # same thing
```

Output is tab-separated, one row per workspace, with per-provider states joined
by commas:

```text
WORKSPACE   PROVIDERS      STATUS
myproject   local,sandbox  running:local,not-created:sandbox
```

| State | Meaning |
| --- | --- |
| `running` | The container exists and is running. |
| `stopped` | The container exists and is stopped. |
| `not-created` | The target is configured but no container exists yet. |
| `unreachable` | The provider could not be contacted (SSH exit 255). |
| `error` | The provider answered, but the state could not be determined. |

## `up`

Create or start a workspace.

```sh
sshpod up <workspace> [--provider <name>] [--config <path>]
```

| Flag | Meaning |
| --- | --- |
| `--provider <NAME>` | Provider target to use. Required when the workspace has several targets and stdin is not a TTY. |
| `--config <PATH>` | Select a discovered `devcontainer.json` by workspace-relative path. Saved to the workspace target. |

The first `up` binds the workspace name to the current directory. Output:

```text
Workspace "myproject" created and started on provider "local" (sshpod-myproject-local)
```

or, when the container already existed:

```text
Workspace "myproject" started on provider "local" (sshpod-myproject-local)
```

## `down`

Stop a workspace without deleting it.

```sh
sshpod down <workspace> [--provider <name>]
```

`down` takes no `--config`; passing it is an error.

```text
Workspace "myproject" stopped on provider "local" (sshpod-myproject-local)
Workspace "myproject" was already stopped on provider "local" (sshpod-myproject-local)
```

## `provider`

Manage local and SSH providers. A subcommand is required.

```sh
sshpod provider list
sshpod provider add <name> --type <local|ssh> [--host <h>] [--podman <cmd>] [--ssh-arg <arg>]...
sshpod provider delete <name>
```

| Flag | Meaning |
| --- | --- |
| `--type <local\|ssh>` | Required. No other values are accepted. |
| `--host <SSH_CONFIG_HOST>` | OpenSSH host or alias. Required for an SSH provider. |
| `--podman <COMMAND>` | Podman-compatible executable or path. Defaults to `podman`. |
| `--ssh-arg <ARG>` | OpenSSH argument to store; may be repeated. Leading hyphens are allowed. |

```text
NAME      TYPE    HOST      PODMAN   DEFAULT
local     local   -         podman   yes
sandbox   ssh     sandbox   podman   -
```

```text
Added provider "sandbox" to /home/me/.config/sshpod/config.yaml
Deleted provider "sandbox"; existing containers and source directories were not deleted
```

See [Providers](/providers) for the details behind each field.

## `doctor`

Check that the local Podman CLI can run, and report its version.

```sh
sshpod doctor
```

```text
Podman CLI: podman version 5.3.1
Local executable check passed. Runtime and remote connectivity were not checked.
```

This is a local check only. It does not contact SSH providers and does not verify
a remote Podman.

## Version

```sh
sshpod -V          # sshpod 0.1.0
sshpod --version   # sshpod 0.1.0 - <git commit>
```

`--version` includes the source Git commit when it was available at build time.
Builds contain no timestamp.
