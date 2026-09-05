# Dev Containers

sshpod reads the same `devcontainer.json` that other Dev Container tools read.
The [Dev Container specification](https://containers.dev/implementors/spec/) is
the compatibility target: sshpod follows it where practical instead of defining
an sshpod-specific workspace format. The long-term goal is for existing
DevPod/devcontainer projects to migrate with little or no modification.

Version 0.1.x interprets a subset. The parser is strict about it — unknown
properties are rejected with `devcontainer property "X" is not supported yet`
rather than silently ignored, so you always know what sshpod did and did not act
on.

## Discovery

Locations are searched in specification order:

1. `.devcontainer/devcontainer.json`
2. `.devcontainer.json`
3. `.devcontainer/<folder>/devcontainer.json` (one level of nesting)

If several nested configurations exist, an interactive terminal prompts for one;
non-interactive callers pass `--config <workspace-relative-path>`. The choice is
saved to the workspace target, so it only has to be made once. When nothing is
found, sshpod stops with an error listing the locations it checked — it never
invents a default environment.

JSON with C and C++ style comments (JSONC) is accepted, so trailing `//` notes in
a real-world `devcontainer.json` parse fine.

## Supported properties

| Property | Notes |
| --- | --- |
| `name` | Used as the workspace label. |
| `image` | Pulled and used as-is. |
| `build.dockerfile`, `build.context` | Simple form only. Exactly one of `image` or `build` must be present. |
| `workspaceFolder` | Defaults to `/workspaces/<workspace>`. |
| `workspaceMount` | Bind mounts only. Defaults to a bind of the source onto the workspace folder. |
| `mounts` | String-form bind mounts only. |
| `containerEnv`, `remoteEnv` | Passed to `podman create` and to lifecycle `exec` calls respectively. |
| `containerUser`, `remoteUser` | Mapped to `--user`. |
| `initializeCommand` | Runs on the host. |
| `onCreateCommand`, `updateContentCommand`, `postCreateCommand`, `postStartCommand` | Run inside the container. |

Lifecycle commands accept both the string form (run through `/bin/sh -c`) and the
argv-array form (run directly).

## Variable substitution

Supported today:

- `${localWorkspaceFolder}` and `${localWorkspaceFolderBasename}`
- `${containerWorkspaceFolder}` and `${containerWorkspaceFolderBasename}`
- `${localEnv:NAME}`
- `${env:NAME}`

Anything else fails loudly with `devcontainer variable ${X} is not supported yet`.

## Lifecycle order

`initializeCommand` runs on the selected host, in the workspace directory. The
remaining commands run inside the container, in basic specification order:

- new container: `onCreateCommand` → `updateContentCommand` → `postCreateCommand`, then `postStartCommand`
- existing container, stopped or already running: `postStartCommand` only

On SSH providers, both host and Podman commands execute through the configured
OpenSSH host.

## Not supported yet

- lifecycle command *objects* (the parallel form)
- Dev Container Features
- `customizations`
- Compose-based configurations
- build arguments and build options
- non-bind mount forms, and the object form of `mounts`
- `forwardPorts`, `portsAttributes`, and port forwarding generally
- `postAttachCommand`
- full variable substitution
- source synchronization from a local directory to a remote host
- container reconciliation after the configuration changes

Reaching for one of these is not a silent failure — sshpod stops and names the
property. Progress against the full specification is tracked on the
[roadmap](/roadmap).

## What the container looks like

sshpod creates the container itself rather than delegating to a shim:

```sh
podman create --name sshpod-<workspace>-<provider> \
  --label sshpod.managed=true \
  --label sshpod.workspace=<workspace> \
  --label sshpod.provider=<provider> \
  [--env K=V ...] [--user U] [--mount ...] \
  <image>
```

It is kept alive by a long sleep loop as its entrypoint, and lifecycle commands
run through `podman exec --workdir <workspaceFolder>`. A `build` configuration is
compiled first with `podman build` and tagged
`localhost/sshpod-<workspace>-<provider>:latest`.

Because the naming and labels are deterministic, plain `podman ps`,
`podman logs`, and `podman exec` all work against an sshpod workspace.
