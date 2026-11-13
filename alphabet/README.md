# Uzbek Cyrillic to the 2026 Latin alphabet

[`cyrillic-to-latin-2026.csv`](cyrillic-to-latin-2026.csv) lists how each Uzbek Cyrillic letter is written in the 2026 Latin alphabet, as implemented by [bitg](https://github.com/dtwinuz/bitg), an open-source Uzbek converter and keyboard. The 2026 alphabet replaces four letters of the previous Latin alphabet: Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç (per the bitg README, law O'RQ-1184 of 2026-10-21).

## Source

The table is transcribed from the mapping in bitg, not written from scratch:

- Repository: <https://github.com/dtwinuz/bitg>
- File: [`crates/bitg-core/src/cyrillic.rs`](https://github.com/dtwinuz/bitg/blob/2de5c946bcd005aa5a428f044c00156100d7a72c/crates/bitg-core/src/cyrillic.rs) (functions `single` and `to_new_latin`)
- Commit: `2de5c946bcd005aa5a428f044c00156100d7a72c` (2026-11-13)
- Default tutuq character: `DEFAULT_TUTUQ = U+02BC` in `crates/bitg-core/src/chars.rs`

If bitg changes its mapping, bitg is authoritative and this table should be regenerated.

## Columns

| Column | Meaning |
|---|---|
| `cyrillic_lower`, `cyrillic_upper` | the Cyrillic letter |
| `latin_lower` | the Latin spelling |
| `latin_upper` | the spelling when the letter is capitalised at the start of a word |
| `condition` | when the row applies; empty means always |

Letters with two rows (`е`, `ц`) depend on the preceding letter, exactly as in bitg:

- `е` is `ye` at the start of a word, after a vowel, or after `ъ` / `ь`; otherwise `e` (ер → yer, поезд → poyezd, келди → keldi).
- `ц` is `ts` after a vowel, otherwise `s` (лицей → litsey, цирк → sirk).
- `ъ` becomes the tutuq sign `ʼ` (U+02BC) (маъно → maʼno). `ь` is dropped.

Case: when a letter that becomes two Latin letters is capitalised, only the first Latin letter is capitalised (Янги → Yangi), unless the whole word is in capitals (ЯНГИ → YANGI, ПОЕЗД → POYEZD).

`щ` and `ы` are not part of the Uzbek Cyrillic alphabet proper; bitg maps them because they occur in Russian loanwords.

The examples above are bitg's own unit tests in the same file.

## Scope

This is a letter table. Converting real text also involves words that should not change (names, foreign words) and the old-Latin-to-2026 direction, which bitg handles with additional rules and a lexicon. For running text, use bitg itself.

## Licence and credit

Derived from bitg, © 2026 dtwinuz and bitg contributors, licensed MIT OR Apache-2.0. This table is distributed under the MIT licence; see [`LICENSE`](LICENSE).
