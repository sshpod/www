# About

`sshpod` is an early-stage Dev Container orchestrator for Podman development
workspaces running locally or on an existing Linux machine over SSH. It discovers
and interprets `devcontainer.json`, then creates and manages the corresponding
Podman workspace.

It is a small, focused alternative to DevPod for developers who only need those
two execution targets.

## Position

sshpod owns the orchestration layer — resolving a provider, materializing the
workspace source, reading the configuration, and driving the container through
its lifecycle. Podman remains the container runtime, OpenSSH remains the
transport, and Git remains the way a project reaches a remote host. None of them
is reimplemented or wrapped in an agent.

The primary compatibility target is the upstream
[Dev Container specification](https://containers.dev/implementors/spec/). sshpod
follows that specification where practical instead of defining an sshpod-specific
workspace format. The long-term goal is for existing DevPod/devcontainer projects
to migrate with little or no modification.

## Requirements it makes of you

Remote hosts must already exist, be reachable through OpenSSH, and have Podman
and Git installed as needed. sshpod manages the workspace and container
lifecycle; it does not provision machines.

## What it does not do

- provision machines or manage cloud infrastructure
- implement SSH, or duplicate `~/.ssh/config`
- replace Podman
- manage IDEs
- orchestrate AI agents

Kubernetes, Docker as a runtime, cloud providers, generic plugins, and the
broader DevPod provider ecosystem are deliberately outside its scope.

## Direction

The long-term use case is persistent remote compute for humans and coding agents
such as Codex, Claude Code, and OpenCode, so the user's laptop need not remain
online. External tools such as Herdr, Moch, and tmux remain responsible for agent
and session management.

## Current state

Version 0.1.x implements a deliberately limited vertical slice: discover a
`devcontainer.json`, create or start its container, report its status, and stop
it. It does not implement the full Dev Container specification, and the
[roadmap](/roadmap) is deliberately conservative about what counts as done.

## Project

- Source: [github.com/sshpod/sshpod](https://github.com/sshpod/sshpod)
- Issues: [github.com/sshpod/sshpod/issues](https://github.com/sshpod/sshpod/issues)
- Contributing: [CONTRIBUTING.md](https://github.com/sshpod/sshpod/blob/main/.github/CONTRIBUTING.md)
- Security policy: [SECURITY.md](https://github.com/sshpod/sshpod/blob/main/.github/SECURITY.md)
- This site: [github.com/sshpod/www](https://github.com/sshpod/www)

sshpod is released under the BSD 3-Clause License, and adapts its engineering
conventions from [cron-when](https://github.com/nbari/cron-when).
