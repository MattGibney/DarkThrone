# Local Domains for DarkThrone Development

This guide explains how to use local domains like:

- `combat-rework.darkthrone.test` for the main game UI
- `api.combat-rework.darkthrone.test` for the API
- `site.combat-rework.darkthrone.test` for the marketing site

`./tools/dev up` regenerates and reloads Caddy routes during bootstrap.

By default the base domain is `darkthrone.test`. You can override it with `LOCAL_DOMAIN_BASE`.
If Caddy is running on the host, the upstream defaults to `127.0.0.1`. Override with `CADDY_UPSTREAM_HOST` if needed.
By default Caddy listens on `8080` to avoid requiring root. Override with `CADDY_HTTP_PORT` if needed.

## macOS Setup (dnsmasq + Caddy)

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
echo "conf-dir=/opt/homebrew/etc/dnsmasq.d,*.conf" | sudo tee -a /opt/homebrew/etc/dnsmasq.conf
```

3. Configure the macOS resolver:
```bash
sudo mkdir -p /etc/resolver
echo "nameserver 127.0.0.1" | sudo tee /etc/resolver/darkthrone.test
```

4. Restart dnsmasq:
```bash
brew services restart dnsmasq
```

5. Start Caddy once:
```bash
./tools/dev caddy
```

Then access an environment via:
```bash
curl -I http://combat-rework.darkthrone.test:8080
```

## Common Issues

### Caddy is not running

```bash
./tools/dev caddy
```

### DNS does not resolve

Check dnsmasq:
```bash
brew services list | rg dnsmasq
```

Verify dnsmasq answers directly:
```bash
dig @127.0.0.1 combat-rework.darkthrone.test
```

If that works but normal resolution fails, flush the DNS cache:
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
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
