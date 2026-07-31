#!/usr/bin/env bash

# Retorna o IP do host Windows a partir do WSL2.
grep -m1 '^nameserver ' /etc/resolv.conf | awk '{print $2}'
