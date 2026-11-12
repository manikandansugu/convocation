// Configuration generated from Dr. T. P. Ganesan Auditorium Seating Layout Excel
export interface BlockConfig {
  start: number
  count: number
}

export interface AuditoriumRowConfig {
  row: string
  tier: 'ground' | 'balcony'
  seatCount: number
  firstSeat: string
  lastSeat: string
  blocks: {
    left: BlockConfig
    center: BlockConfig
    right: BlockConfig
  }
}

export const AUDITORIUM_ROWS: AuditoriumRowConfig[] = [
  {
    "row": "A",
    "tier": "ground",
    "seatCount": 54,
    "firstSeat": "A1",
    "lastSeat": "A54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "B",
    "tier": "ground",
    "seatCount": 52,
    "firstSeat": "B1",
    "lastSeat": "B52",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 26
      },
      "right": {
        "start": 40,
        "count": 13
      }
    }
  },
  {
    "row": "C",
    "tier": "ground",
    "seatCount": 55,
    "firstSeat": "C1",
    "lastSeat": "C55",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 29
      },
      "right": {
        "start": 43,
        "count": 13
      }
    }
  },
  {
    "row": "D",
    "tier": "ground",
    "seatCount": 53,
    "firstSeat": "D1",
    "lastSeat": "D53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "E",
    "tier": "ground",
    "seatCount": 54,
    "firstSeat": "E1",
    "lastSeat": "E54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "F",
    "tier": "ground",
    "seatCount": 54,
    "firstSeat": "F1",
    "lastSeat": "F54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "G",
    "tier": "ground",
    "seatCount": 54,
    "firstSeat": "G1",
    "lastSeat": "G54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "H",
    "tier": "ground",
    "seatCount": 52,
    "firstSeat": "H1",
    "lastSeat": "H52",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 26
      },
      "right": {
        "start": 40,
        "count": 13
      }
    }
  },
  {
    "row": "I",
    "tier": "ground",
    "seatCount": 54,
    "firstSeat": "I1",
    "lastSeat": "I54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "J",
    "tier": "ground",
    "seatCount": 52,
    "firstSeat": "J1",
    "lastSeat": "J52",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 26
      },
      "right": {
        "start": 40,
        "count": 13
      }
    }
  },
  {
    "row": "K",
    "tier": "ground",
    "seatCount": 51,
    "firstSeat": "K1",
    "lastSeat": "K51",
    "blocks": {
      "left": {
        "start": 1,
        "count": 12
      },
      "center": {
        "start": 13,
        "count": 27
      },
      "right": {
        "start": 40,
        "count": 12
      }
    }
  },
  {
    "row": "L",
    "tier": "ground",
    "seatCount": 52,
    "firstSeat": "L1",
    "lastSeat": "L52",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 26
      },
      "right": {
        "start": 40,
        "count": 13
      }
    }
  },
  {
    "row": "M",
    "tier": "ground",
    "seatCount": 51,
    "firstSeat": "M1",
    "lastSeat": "M51",
    "blocks": {
      "left": {
        "start": 1,
        "count": 12
      },
      "center": {
        "start": 13,
        "count": 27
      },
      "right": {
        "start": 40,
        "count": 12
      }
    }
  },
  {
    "row": "N",
    "tier": "ground",
    "seatCount": 51,
    "firstSeat": "N1",
    "lastSeat": "N51",
    "blocks": {
      "left": {
        "start": 1,
        "count": 12
      },
      "center": {
        "start": 13,
        "count": 27
      },
      "right": {
        "start": 40,
        "count": 12
      }
    }
  },
  {
    "row": "O",
    "tier": "ground",
    "seatCount": 53,
    "firstSeat": "O1",
    "lastSeat": "O53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "P",
    "tier": "ground",
    "seatCount": 53,
    "firstSeat": "P1",
    "lastSeat": "P53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "Q",
    "tier": "ground",
    "seatCount": 56,
    "firstSeat": "Q1",
    "lastSeat": "Q56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "R",
    "tier": "ground",
    "seatCount": 54,
    "firstSeat": "R1",
    "lastSeat": "R54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "S",
    "tier": "ground",
    "seatCount": 56,
    "firstSeat": "S1",
    "lastSeat": "S56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "T",
    "tier": "ground",
    "seatCount": 56,
    "firstSeat": "T1",
    "lastSeat": "T56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "U",
    "tier": "ground",
    "seatCount": 56,
    "firstSeat": "U1",
    "lastSeat": "U56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "V",
    "tier": "ground",
    "seatCount": 56,
    "firstSeat": "V1",
    "lastSeat": "V56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "W",
    "tier": "ground",
    "seatCount": 53,
    "firstSeat": "W1",
    "lastSeat": "W53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "X",
    "tier": "ground",
    "seatCount": 53,
    "firstSeat": "X1",
    "lastSeat": "X53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "Y",
    "tier": "ground",
    "seatCount": 57,
    "firstSeat": "Y1",
    "lastSeat": "Y57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "Z",
    "tier": "ground",
    "seatCount": 57,
    "firstSeat": "Z1",
    "lastSeat": "Z57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "AA",
    "tier": "balcony",
    "seatCount": 54,
    "firstSeat": "AA1",
    "lastSeat": "AA54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "BB",
    "tier": "balcony",
    "seatCount": 54,
    "firstSeat": "BB1",
    "lastSeat": "BB54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "CC",
    "tier": "balcony",
    "seatCount": 55,
    "firstSeat": "CC1",
    "lastSeat": "CC55",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 29
      },
      "right": {
        "start": 43,
        "count": 13
      }
    }
  },
  {
    "row": "DD",
    "tier": "balcony",
    "seatCount": 53,
    "firstSeat": "DD1",
    "lastSeat": "DD53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "EE",
    "tier": "balcony",
    "seatCount": 54,
    "firstSeat": "EE1",
    "lastSeat": "EE54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "FF",
    "tier": "balcony",
    "seatCount": 57,
    "firstSeat": "FF1",
    "lastSeat": "FF57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "GG",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "GG1",
    "lastSeat": "GG56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "HH",
    "tier": "balcony",
    "seatCount": 57,
    "firstSeat": "HH1",
    "lastSeat": "HH57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "II",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "II1",
    "lastSeat": "II56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "JJ",
    "tier": "balcony",
    "seatCount": 57,
    "firstSeat": "JJ1",
    "lastSeat": "JJ57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "KK",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "KK1",
    "lastSeat": "KK56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "LL",
    "tier": "balcony",
    "seatCount": 53,
    "firstSeat": "LL1",
    "lastSeat": "LL53",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 27
      },
      "right": {
        "start": 41,
        "count": 13
      }
    }
  },
  {
    "row": "MM",
    "tier": "balcony",
    "seatCount": 57,
    "firstSeat": "MM1",
    "lastSeat": "MM57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "NN",
    "tier": "balcony",
    "seatCount": 54,
    "firstSeat": "NN1",
    "lastSeat": "NN54",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 28
      },
      "right": {
        "start": 42,
        "count": 13
      }
    }
  },
  {
    "row": "OO",
    "tier": "balcony",
    "seatCount": 57,
    "firstSeat": "OO1",
    "lastSeat": "OO57",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 29
      },
      "right": {
        "start": 44,
        "count": 14
      }
    }
  },
  {
    "row": "PP",
    "tier": "balcony",
    "seatCount": 58,
    "firstSeat": "PP1",
    "lastSeat": "PP58",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 30
      },
      "right": {
        "start": 45,
        "count": 14
      }
    }
  },
  {
    "row": "QQ",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "QQ1",
    "lastSeat": "QQ56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "RR",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "RR1",
    "lastSeat": "RR56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "SS",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "SS1",
    "lastSeat": "SS56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "TT",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "TT1",
    "lastSeat": "TT56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "UU",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "UU1",
    "lastSeat": "UU56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "VV",
    "tier": "balcony",
    "seatCount": 56,
    "firstSeat": "VV1",
    "lastSeat": "VV56",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 28
      },
      "right": {
        "start": 43,
        "count": 14
      }
    }
  },
  {
    "row": "WW",
    "tier": "balcony",
    "seatCount": 58,
    "firstSeat": "WW1",
    "lastSeat": "WW58",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 30
      },
      "right": {
        "start": 45,
        "count": 14
      }
    }
  },
  {
    "row": "XX",
    "tier": "balcony",
    "seatCount": 58,
    "firstSeat": "XX1",
    "lastSeat": "XX58",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 30
      },
      "right": {
        "start": 45,
        "count": 14
      }
    }
  },
  {
    "row": "YY",
    "tier": "balcony",
    "seatCount": 58,
    "firstSeat": "YY1",
    "lastSeat": "YY58",
    "blocks": {
      "left": {
        "start": 1,
        "count": 14
      },
      "center": {
        "start": 15,
        "count": 30
      },
      "right": {
        "start": 45,
        "count": 14
      }
    }
  },
  {
    "row": "ZZ",
    "tier": "balcony",
    "seatCount": 55,
    "firstSeat": "ZZ1",
    "lastSeat": "ZZ55",
    "blocks": {
      "left": {
        "start": 1,
        "count": 13
      },
      "center": {
        "start": 14,
        "count": 29
      },
      "right": {
        "start": 43,
        "count": 13
      }
    }
  }
];

export const TOTAL_SEAT_COUNT = 2852;
export const GROUND_SEAT_COUNT = 1399;
export const BALCONY_SEAT_COUNT = 1453;

export const AUDITORIUM_ROW_MAP = new Map<string, AuditoriumRowConfig>(
  AUDITORIUM_ROWS.map((r) => [r.row, r])
);

export function parseSeatId(seatId: string): { row: string; number: number } | null {
  if (!seatId) return null;
  const cleaned = seatId.trim().toUpperCase().replace(/\s+/g, '');
  // Match formats: 'A-6', 'A6', 'AA-14', 'AA14'
  const match = cleaned.match(/^([A-Z]{1,2})[-_]?(\d+)$/);
  if (!match) return null;
  const row = match[1];
  const number = parseInt(match[2], 10);
  return { row, number };
}

export function getBlockName(row: string, seatNumber: number): 'Left Block' | 'Center Block' | 'Right Block' | null {
  const config = AUDITORIUM_ROW_MAP.get(row);
  if (!config) return null;
  if (seatNumber >= config.blocks.left.start && seatNumber < config.blocks.left.start + config.blocks.left.count) {
    return 'Left Block';
  }
  if (seatNumber >= config.blocks.center.start && seatNumber < config.blocks.center.start + config.blocks.center.count) {
    return 'Center Block';
  }
  if (seatNumber >= config.blocks.right.start && seatNumber < config.blocks.right.start + config.blocks.right.count) {
    return 'Right Block';
  }
  return null;
}
