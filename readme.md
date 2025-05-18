# ApiGen

Automatikus dokumentációgenerátor REST API bemenetekhez és kimenetekhez LLM technológia segítségével.

A projekt Deno TypeScript környezetben készült, a következő fő komponensekkel:
- API specifikáció elemzők különböző formátumokhoz
- Dokumentáció generáló motorok
- Parancssori interfész a @cliffy/command könyvtárral

## Rendszerkövetelmények

A program futtatásához a következők szükségesek a felhasználó rendszerén:
- [**Deno**](https://deno.com): A JavaScript és TypeScript runtime környezet
- [**Ollama**](https://ollama.com/download): A lokális nyelvi modellek futtatásához szükséges keretrendszer
- **Ollama modell** (pl. [gemma3:1b](https://ollama.com/library/gemma3:1b)): Egy letöltött Ollama nyelvi modell. Konfigurálható, hogy a program milyen modellt használ.
- Futó Ollama folyamat

## Fordítás

A program futtatható bináris formátumban lefordítható az alábbi paranccsal:

```bash
deno compile -o apigen  --allow-read --allow-write --allow-net main.ts
```

## Használat

Az ApiGen parancssori alkalmazásként használható a következő paraméterekkel:

```bash
apigen --model <ollama-modell> --input <specifikációs-fájl> [opciók]
```

### Kötelező paraméterek

- `-m, --model <modell>`: A dokumentáció generálásához használt Ollama LLM modell neve
- `-i, --input <fájl>`: Az API specifikációs fájl (JSON, YAML vagy szöveges formátumban)

### Opcionális paraméterek

- `-f, --format <formátum>`: A bemeneti fájl formátuma (json, yaml vagy text) - alapértelmezett: "text"
- `-o, --output <könyvtár>`: A generált dokumentáció kimeneti könyvtára - alapértelmezett: "./docs"
- `-v, --verbose`: Részletes konzol kimenet engedélyezése

## Példa

Egy felhasználói API specifikáció dokumentálása:

```bash
apigen --model gemma3:1b --input examples/user-api-spec.json --format json --output ./dokumentacio
```

Ez a parancs:
1. Beolvassa a user-api-spec.json fájlt
2. Feldolgozza a benne lévő API végpontokat
3. A llama3 modell segítségével dokumentációt generál minden végponthoz
4. Az eredményt a "./dokumentacio" könyvtárba menti Markdown fájlokként
5. Létrehoz egy index.md fájlt, amely az összes dokumentált végpontot tartalmazza

Példaként egy `YAML` és egy sima szöveges fájlt is megadtam a `JSON` mellett az `examples` könyvtárban.

## Támogatott API specifikáció formátumok

- **JSON**: Strukturált JSON formátumú API leírások
- **YAML**: YAML formátumú API specifikációk
- **Szöveg**: Egyszerű szöveges API leírások
