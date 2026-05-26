from pathlib import Path
import re

import fitz


ROOT = Path(__file__).resolve().parents[3]
BOOK_NAMES = [
    "22개정_라이트쎈_공통수학1.pdf",
    "22개정_라이트쎈_공통수학2.pdf",
    "22개정_라이트쎈_ 대수.pdf",
    "22개정_라이트쎈_중1-1.pdf",
    "22개정_라이트쎈_중1-2.pdf",
    "22개정_라이트쎈_중2-1.pdf",
]


def page_codes(page):
    codes = []
    for word in page.get_text("words"):
        text = str(word[4]).strip()
        if re.fullmatch(r"\d{4}", text):
            codes.append(text)
    return codes


def main():
    for name in BOOK_NAMES:
        path = ROOT / name
        doc = fitz.open(path)
        print(f"\n=== {name} pages={len(doc)} toc={len(doc.get_toc())}")
        if doc.get_toc():
            print("toc_first=", doc.get_toc()[:12])
        for page_no in list(range(1, min(15, len(doc)) + 1)) + [20, 30, 40, 60, 80, 100, 120, 140, 160, 180, 200]:
            if page_no > len(doc):
                continue
            page = doc[page_no - 1]
            codes = page_codes(page)
            text = page.get_text("text").replace("\n", " | ")[:300]
            if codes or page_no <= 6:
                print(f"p{page_no:03d} codes={codes[:20]} text={text}")


if __name__ == "__main__":
    main()
