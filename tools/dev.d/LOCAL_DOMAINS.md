# Local Domains for DarkThrone Development

This guide explains how to use local domains like:

- `combat-rework.darkthrone.test` for the main game UI
- `api.combat-rework.darkthrone.test` for the API
- `site.combat-rework.darkthrone.test` for the marketing site

`./tools/dev up` regenerates and reloads Caddy routes during bootstrap.

By default the base domain is `darkthrone.test`. You can override it with `LOCAL_DOMAIN_BASE`.
If Caddy is running on the host, the upstream defaults to `127.0.0.1`. Override with `CADDY_UPSTREAM_HOST` if needed.
By default Caddy listens on `8080` to avoid requiring root. Override with `CADDY_HTTP_PORT` if needed.

If you use several local projects at once, prefer a shared `.test` resolver instead
of a project-specific `darkthrone.test` resolver. That lets `69aa.darkthrone.test`,
`api.other-app.test`, and any other `*.test` hostnames coexist on the same machine.

## macOS Setup (dnsmasq + Caddy)

### Option A: Shared `.test` resolver (recommended for multiple local projects)

1. Install dependencies:
```bash
brew install dnsmasq caddy
```

2. Configure dnsmasq to resolve every `*.test` hostname to `127.0.0.1`:
```bash
sudo mkdir -p /opt/homebrew/etc/dnsmasq.d
echo "address=/.test/127.0.0.1" | sudo tee /opt/homebrew/etc/dnsmasq.d/test.conf
```

2a. Ensure dnsmasq loads `.d` configs:
```bash
rg -q '^conf-dir=/opt/homebrew/etc/dnsmasq.d,\*\.conf$' /opt/homebrew/etc/dnsmasq.conf \
  || echo "conf-dir=/opt/homebrew/etc/dnsmasq.d,*.conf" | sudo tee -a /opt/homebrew/etc/dnsmasq.conf
```

3. Configure the macOS resolver for `.test`:
```bash
sudo mkdir -p /etc/resolver
echo "nameserver 127.0.0.1" | sudo tee /etc/resolver/test
```

4. Restart dnsmasq and flush DNS caches:
```bash
sudo brew services restart dnsmasq
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

5. Start or reload Caddy:
```bash
./tools/dev caddy
```

6. Verify resolution:
```bash
dscacheutil -q host -a name 69aa.darkthrone.test
curl -I http://69aa.darkthrone.test:8080
```

This setup works even if DarkThrone keeps using `darkthrone.test` as its base
domain, because `69aa.darkthrone.test` still ends with `.test`.

If you want DarkThrone itself to use shorter hosts like `69aa.test`, set:
```bash
LOCAL_DOMAIN_BASE=test
```

### Option B: Project-specific `darkthrone.test` resolver
1. Install dependencies:
```bash
brew install dnsmasq caddy
```

2. Configure dnsmasq to resolve `*.darkthrone.test` to `127.0.0.1`:
```bash
sudo mkdir -p /opt/homebrew/etc/dnsmasq.d
echo "address=/darkthrone.test/127.0.0.1" | sudo tee /opt/homebrew/etc/dnsmasq.d/darkthrone-test.conf
```

2a. Ensure dnsmasq loads `.d` configs:
```bash
rg -q '^conf-dir=/opt/homebrew/etc/dnsmasq.d,\*\.conf$' /opt/homebrew/etc/dnsmasq.conf \
  || echo "conf-dir=/opt/homebrew/etc/dnsmasq.d,*.conf" | sudo tee -a /opt/homebrew/etc/dnsmasq.conf
```

3. Configure the macOS resolver:
```bash
sudo mkdir -p /etc/resolver
echo "nameserver 127.0.0.1" | sudo tee /etc/resolver/darkthrone.test
```

4. Restart dnsmasq:
```bash
sudo brew services restart dnsmasq
```

5. Flush the macOS DNS cache so the new resolver is picked up immediately:
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

6. Start Caddy once:
```bash
./tools/dev caddy
```

7. Verify DNS and the proxied route before opening the browser:
```bash
dig +short @127.0.0.1 combat-rework.darkthrone.test
dscacheutil -q host -a name combat-rework.darkthrone.test
curl -I http://combat-rework.darkthrone.test:8080
```

This suffix-specific setup does not interfere with other local project domains.
For example, `/etc/resolver/darkthrone.test` can coexist with
`/etc/resolver/set1.test`, and matching dnsmasq rules for both domains can
point at the same local dnsmasq instance on `127.0.0.1`.

## Common Issues

### Caddy is not running

```bash
./tools/dev caddy
```

### DNS does not resolve

Check that the resolver file and dnsmasq rule exist:
```bash
ls -l /etc/resolver/darkthrone.test
ls -l /opt/homebrew/etc/dnsmasq.d/darkthrone-test.conf
```

Check dnsmasq:
```bash
brew services list | rg dnsmasq
```

If `brew services list` shows `dnsmasq` as `error` or `loaded: true` but
`running: false`, it was likely started as a user LaunchAgent and failed to
bind port `53`. Re-register it as a root service:
```bash
brew services stop dnsmasq
sudo brew services start dnsmasq
```

If `sudo brew services start dnsmasq` says the service is "already started"
after switching scopes, that usually means the root plist exists but is not
actually loaded. Restart it instead:
```bash
sudo brew services restart dnsmasq
```

Verify dnsmasq answers directly:
```bash
dig +short @127.0.0.1 combat-rework.darkthrone.test
```

If `dig` returns nothing or `NXDOMAIN`, restart dnsmasq first. A stale daemon will keep serving the old config even if the files on disk are correct:
```bash
brew services restart dnsmasq
```

Then flush the DNS cache:
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

Re-run the direct and system resolver checks:
```bash
dig +short @127.0.0.1 combat-rework.darkthrone.test
dscacheutil -q host -a name combat-rework.darkthrone.test
```

If direct dnsmasq lookups work but the hostname still does not resolve normally, inspect the macOS DNS configuration:
```bash
scutil --dns | sed -n '/darkthrone.test/,+10p'
```

### Caddy validates but the browser URL still fails

First verify the route that `./tools/dev caddy` generated:
```bash
caddy validate --config .data/caddy/Caddyfile --adapter caddyfile
```

Then confirm Caddy can reach the upstream app:
```bash
./tools/dev info
curl -I http://127.0.0.1:<web-app-port>
```

If the Caddyfile validation fails after switching worktrees or re-running `./tools/dev up`, regenerate it:
```bash
./tools/dev caddy
```

## Docker Runtime

Both Docker Desktop and Colima are supported. The bootstrap script auto-detects Colima and will offer to start it if Docker is not reachable.

If using Colima:
```bash
brew install colima docker docker-compose
colima start
```

## Cleanup

If old Docker Compose projects remain after deleting worktrees, run:

```bash
./tools/dev cleanup
```
