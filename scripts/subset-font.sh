#!/usr/bin/env bash
# Rebuilds src/assets/fonts/InterVariable-latin.woff2 from the official Inter release.
#
# Why not Fontsource or Google Fonts: their Latin subsets strip Inter's stylistic
# features (cv05, ss03 and friends), so the face can't be configured. This keeps the
# features the site uses, limits weight to the 400-600 range in the type scale, and
# keeps the optical-size axis so large headings get Inter Display automatically.
#
# Needs: pip install fonttools brotli
set -euo pipefail
tmp="$(mktemp -d)"
( cd "$tmp" && npm pack inter-ui@4.1.1 --silent && tar xzf inter-ui-4.1.1.tgz )
python3 -m fontTools.varLib.instancer "$tmp/package/variable/InterVariable.woff2" wght=400:600 -o "$tmp/inter.ttf"
pyftsubset "$tmp/inter.ttf" \
  --output-file=src/assets/fonts/InterVariable-latin.woff2 --flavor=woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2196-2199,U+21B5,U+2212,U+2318,U+2325,U+2713" \
  --layout-features="kern,mark,mkmk,ccmp,locl,calt,tnum,pnum,case,zero,frac,ss01,ss03,cv05,cv08,cv11" \
  --no-hinting --desubroutinize
ls -la src/assets/fonts/InterVariable-latin.woff2
