# Configuration

sshpod keeps its own state in a single YAML file: the providers you have defined,
and the workspace targets bound to them. Nothing else.

## Location

```text
$XDG_CONFIG_HOME/sshpod/config.yaml
```

If `XDG_CONFIG_HOME` is unset, empty, or relative, sshpod falls back to:

```text
$HOME/.config/sshpod/config.yaml
```

Reading configuration creates neither the file nor its directory — a missing file
simply means no providers and no workspaces. Commands that write configuration
create the directory when needed. Writes are atomic: the new content goes to
`config.yaml.tmp` and is then renamed over the target, and both the directory and
the file are created with private permissions (`0700` and `0600`).

## Example

```yaml
defaultProvider: local

providers:
  local:
    type: local

  sandbox:
    type: ssh
    host: sandbox

  infra-vm:
    type: ssh
    host: devops@infra.taildc7568.ts.net
    podman: podman
    sshArgs:
      - -A

workspaces:
  myproject:
    targets:
      local:
        source: /home/me/projects/myproject
      sandbox:
        source: git@github.com:example/myproject.git
        devcontainer: .devcontainer/rust/devcontainer.json
```

## `providers`

A map of provider name to definition. Only `local` and `ssh` types exist.

| Key | Applies to | Default | Meaning |
| --- | --- | --- | --- |
| `type` | both | — | `local` or `ssh`. Required. |
| `host` | `ssh` | — | OpenSSH host, `user@host`, or `~/.ssh/config` alias. Required for `ssh`. |
| `podman` | both | `podman` | Podman-compatible executable or path. |
| `sshArgs` | `ssh` | `[]` | Extra arguments passed to the system `ssh` command. |

Because `podman` and `sshArgs` have defaults, a minimal provider needs only
`type` (plus `host` for SSH).

::: warning Milestone note
`defaultProvider`, a custom `podman`, and `sshArgs` are part of the configuration
API in this milestone, but do not yet alter workspace execution. Runtime provider
selection and command behavior are unchanged by them.
:::

## `workspaces`

A map of logical workspace name to its `targets`, keyed by provider name.

| Key | Required | Meaning |
| --- | --- | --- |
| `source` | yes | Where the project lives for that provider: an absolute local path, a Git URL to clone on the remote host, or an existing absolute remote path. |
| `devcontainer` | no | Workspace-relative path to the `devcontainer.json` to use. Managed for you when `--config` or the interactive selector is used. |

The first `sshpod up` writes the target for you, so this section is normally
generated rather than hand-written. Editing it by hand is how you point an SSH
target at an existing absolute directory on the remote host instead of a Git URL.

## Validation

The file is parsed strictly: duplicate keys are an error, and unknown fields are
rejected rather than silently ignored. Configuration is also rejected when:

- a workspace references a provider that does not exist
- a workspace has no targets, or a target has an empty `source`
- a provider name or workspace name breaks the [naming rules](/providers#naming-rules)
- `provider add` reuses an existing provider name
- `provider delete` targets the provider named by `defaultProvider` — change `defaultProvider` first

## What is deliberately absent

The format intentionally carries none of DevPod's contexts, initialization
metadata, plugin options, credential-injection settings, agent paths, ports, or
inactivity state. sshpod stores only its own providers and optional workspace
state; everything about the container itself comes from
[`devcontainer.json`](/devcontainer), and everything about SSH comes from
`~/.ssh/config`.
