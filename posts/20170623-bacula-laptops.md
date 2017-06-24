---
title: Backing up Laptops with Bacula
---

## SSH Tunnels for Connectivity

```
ssh -N -i ${HOME}/.ssh/id_rsa -L 19101:localhost:9101 bacula.example.com
```

```
ssh -N -i ${HOME}/.ssh/id_rsa -R 19102:localhost:9102 bacula.example.com
```

TODO Alternatives

## Drive with `bconsole`

```bash
echo "
run job=${JOB}
yes
wait
" | bconsole
```

## `bconsole` Configuration

```
Director {
  Name = "example-dir";
  Address = "localhost";
  DIR Port = 19101;
  Password = "29c707eaff344735b4e40daa91cb0b2a";
}
```
