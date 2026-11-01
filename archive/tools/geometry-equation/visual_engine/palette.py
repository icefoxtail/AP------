"""Colour groups of plane and coordinate figures (C1). The same table as production/palette.mjs (tests/palette-c1.test.mjs and tests/test_palette_c1.py tie the copies):
`fill` + `opacity` tint a region or an angle sector (the same values as a solid figure's highlight fills; BLUE is its LIGHT blue), `line` is the darker line
colour of the same hue for segments, angle arcs and equal / parallel marks."""
PALETTE={
    'BLUE':{'fill':'#7fa6e8','opacity':0.32,'line':'#1f5fa8'},
    'WARM':{'fill':'#f2a65a','opacity':0.42,'line':'#b85c00'},
    'GREEN':{'fill':'#6fcf97','opacity':0.42,'line':'#2e7d32'},
    'ROSE':{'fill':'#e98aa8','opacity':0.42,'line':'#b8325f'},
    'VIOLET':{'fill':'#a78bdb','opacity':0.42,'line':'#6b46b3'},
}
PALETTE_NAMES=tuple(PALETTE)
COLORED_SEGMENT_WIDTH=2.4   # stroke width of a coloured segment (a plain one is 1.6, an emphasised one 3.0)
