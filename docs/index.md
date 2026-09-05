---
layout: home

hero:
  name: sshpod
  tagline: "Podman development workspaces, locally or over SSH."
  image:
    src: /logo.png
    alt: sshpod logo
  actions:
    - theme: brand
      text: Install
      link: /install
    - theme: alt
      text: Quick Start
      link: /quick-start

features:
  - title: "devcontainer.json is the input"
    details: "sshpod discovers .devcontainer/devcontainer.json in specification order and interprets it. The Dev Container specification is the compatibility target, not an sshpod-specific workspace format."
    link: /devcontainer
  - title: "Two execution targets"
    details: "A local Podman socket, or Podman on an existing Linux machine reached over SSH. Those are the only two, on purpose."
    link: /providers
  - title: "No agent to install"
    details: "sshpod shells out to the system ssh command, so hosts, identities, and proxy jumps stay in ~/.ssh/config. Nothing is installed on the remote beyond Podman and Git."
    link: /providers
---

> `sshpod` is early-stage software. Version 0.1.x implements a deliberately limited vertical slice — discover a `devcontainer.json`, create or start its container, report its status, and stop it. It does not implement the full Dev Container specification. The [roadmap](/roadmap) tracks what is verified as complete.
