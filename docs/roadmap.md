# Roadmap

Dev Container compatibility is the primary milestone. This checklist tracks
*complete, compatibility-tested* behavior. Prototype support — the parts
described on the [Dev Containers](/devcontainer) page that already work in
0.1.x — does not count as complete, so items stay unchecked until their semantics
and real-world compatibility have been validated.

That is why almost everything below is unchecked even though the code already
does much of it. The checklist is a compatibility contract, not a progress bar.

## Core

- [x] Discover `.devcontainer/devcontainer.json`
- [x] Discover `.devcontainer.json`
- [x] Discover `.devcontainer/<folder>/devcontainer.json`
- [ ] Parse JSONC and validate the Dev Container configuration
- [ ] Environment-variable substitution
- [ ] Deterministic workspace/container naming

## Dev Container compatibility

- [ ] `image`
- [ ] `build`
- [ ] Dockerfile-based environments through Podman
- [ ] `containerEnv`
- [ ] `remoteEnv`
- [ ] `mounts`
- [ ] `workspaceMount`
- [ ] `workspaceFolder`
- [ ] `containerUser`
- [ ] `remoteUser`
- [ ] `forwardPorts`
- [ ] `portsAttributes`
- [ ] `features`
- [ ] `customizations`
- [ ] Full Dev Container variable substitution

## Lifecycle

- [ ] `initializeCommand`
- [ ] `onCreateCommand`
- [ ] `updateContentCommand`
- [ ] `postCreateCommand`
- [ ] `postStartCommand`
- [ ] `postAttachCommand`
- [ ] Lifecycle command execution and ordering
- [ ] Workspace start, stop, delete, and status
- [ ] Interactive exec/SSH into a workspace
- [ ] Persistent named volumes

## Local Podman

- [ ] Local Podman workspace creation

## SSH/Remote Podman

- [ ] Remote Podman workspace creation over system SSH
- [ ] Clone and reuse a remote Git workspace source
- [ ] Synchronize a local project directory to a remote host

## Compatibility and testing

- [ ] Unit coverage without requiring Podman or SSH
- [ ] Compatibility testing against real-world `.devcontainer` configurations

## Out of scope

These are not unchecked items — they are decisions. See [About](/about).

- Kubernetes and cloud provider backends
- Docker as a container runtime
- A generic provider or plugin ecosystem
- Machine provisioning, IDE management, and agent orchestration
