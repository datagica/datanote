

export function pageLength (page) {
  console.log("counting len of page ", page)
  return page.getTextContent().then(textContents =>
    textContents.items.reduce((len, textContent) => (len + textContent.str.length), 0)
  ).catch(err => {
    console.error("couldn't count len of page ", page)
    return 0
  })
}

export function computePageLength (pdf, pageIndex) {
  console.log("counting page length of page "+pageIndex)
  return pdf.getPage(pageIndex).then(page => Promise.resolve(pageLength(page)))
}


// (NOT USED) count words up to pageIndex
export function countPagesLength (pdf) {
  const numPages = pdf ? pdf.pdfInfo.numPages : 0;
  console.log("PDF has "+numPages.length+" pages")
  return Promise.all(
    Array.apply(null, { length: numPages })
    .map((v, i) =>
      computePageLength(pdf, i + 1)
      .then(len => ({
        i: i,
        index: i + 1,
        len: len
      }))
    )
  )
}
