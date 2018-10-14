//----------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
// Released under the Microsoft Office Extensible File License
// https://raw.github.com/stephen-hardy/docx.js/master/LICENSE.txt
//----------------------------------------------------------

var docx = {
	convertContent: function (input) { // Convert HTML to WordprocessingML, and vice versa
		var output,
		inputDoc,
		id,
		doc,
		inNode,
		outNode,
		styleAttrNode,
		pCount = 0,
		tempStr,
		tempNode,
		val;

		function newXMLnode(nodeName, text) {
			var name = nodeName;
			if (name.indexOf(":") < 0) {
				name = 'w:' + name;
			}
			var el = doc.createElement(name);
			if (text) { el.appendChild(doc.createTextNode(text)); }
			return el;
		}
		function newHTMLnode(name, html) {
			var el = document.createElement(name);
			el.innerHTML = html || '';
			return el;
		}
		function color(str) { // Return hex or named color
			if (str.charAt(0) === '#') { return str.substr(1); }
			if (str.indexOf('rgb') < 0) { return str; }
			var values = (/rgb\((\d+), (\d+), (\d+)\)/).exec(str),
			red = +values[1],
			green = +values[2],
			blue = +values[3];

			return (blue | (green << 8) | (red << 16)).toString(16);
		}
		function paragraph(inNode) { // makes P element
			var outNode = newHTMLnode('P');
			tempStr = '';
			for (var k = 0; k < inNode.childNodes.length; k++) {
				var inNodeChild = inNode.childNodes[k];
				if (inNodeChild.nodeName === 'pPr') {
					if (styleAttrNode = inNodeChild.getElementsByTagName('jc')[0]) {
						outNode.style.textAlign = styleAttrNode.getAttribute('w:val');
					}
					if (styleAttrNode = inNodeChild.getElementsByTagName('pBdr')[0]) {
						setBorders(outNode, styleAttrNode);
					}
				}
				if (inNodeChild.nodeName === 'r') {
					val = inNodeChild.textContent;
					if (inNodeChild.getElementsByTagName('b').length) {
						val = '<b>' + val + '</b>';
					}
					if (inNodeChild.getElementsByTagName('i').length) {
						val = '<i>' + val + '</i>';
					}
					if (inNodeChild.getElementsByTagName('u').length) {
						val = '<u>' + val + '</u>';
					}
					if (inNodeChild.getElementsByTagName('strike').length) {
						val = '<s>' + val + '</s>';
					}
					if (styleAttrNode = inNodeChild.getElementsByTagName('vertAlign')[0]) {
						if (styleAttrNode.getAttribute('w:val') === 'subscript') {
							val = '<sub>' + val + '</sub>';
						}
						if (styleAttrNode.getAttribute('w:val') === 'superscript') {
							val = '<sup>' + val + '</sup>';
						}
					}
					if (styleAttrNode = inNodeChild.getElementsByTagName('sz')[0]) {
						val = '<span style="font-size:' + (styleAttrNode.getAttribute('w:val') / 2) + 'pt">' + val + '</span>';
					}
					if (styleAttrNode = inNodeChild.getElementsByTagName('highlight')[0]) {
						val = '<span style="background-color:' + styleAttrNode.getAttribute('w:val') + '">' + val + '</span>';
					}
					if (styleAttrNode = inNodeChild.getElementsByTagName('color')[0]) {
						val = '<span style="color:#' + styleAttrNode.getAttribute('w:val') + '">' + val + '</span>';
					}
					/* TODO: Buggy image upload? */
					/*if (styleAttrNode = inNodeChild.getElementsByTagName('blip')[0]) {
						id = styleAttrNode.getAttribute('r:embed');
						tempNode = toXML(input.files['word/_rels/document.xml.rels'].data);
						k = tempNode.childNodes.length;
						while (k--) {
							if (tempNode.childNodes[k].getAttribute('Id') === id) {
								val = '<img src="data:image/png;base64,' +
									JSZipBase64.encode(input.files['word/' +
									tempNode.childNodes[k].getAttribute('Target')].data) +
									'">';
								break;
							}
						}
					}*/
					tempStr += val;
				}
				outNode.innerHTML = tempStr;
				if (outNode.innerHTML === "") {
					outNode.innerHTML = "&nbsp;";
				}
			}
			return outNode;
		}
		function setBorders(htmlNode, bNode) {
			for (var bsp = 0; bsp < bNode.childNodes.length; bsp++) {
				if (bNode.childNodes[bsp].nodeName === 'top') {
					htmlNode.style.borderTopWidth = bNode.childNodes[bsp].getAttribute('w:sz') / 4 + "pt";
					htmlNode.style.borderTopStyle = "solid";
					htmlNode.style.borderTopColor = "black";
				}
				if (bNode.childNodes[bsp].nodeName === 'bottom') {
					htmlNode.style.borderBottomWidth = bNode.childNodes[bsp].getAttribute('w:sz') / 4 + "pt";
					htmlNode.style.borderBottomStyle = "solid";
					htmlNode.style.borderBottomColor = "black";
				}
				if (bNode.childNodes[bsp].nodeName === 'left') {
					htmlNode.style.borderLeftWidth = bNode.childNodes[bsp].getAttribute('w:sz') / 4 + "pt";
					htmlNode.style.borderLeftStyle = "solid";
					htmlNode.style.borderLeftColor = "black";
				}
				if (bNode.childNodes[bsp].nodeName === 'right') {
					htmlNode.style.borderRightWidth = bNode.childNodes[bsp].getAttribute('w:sz') / 4 + "pt";
					htmlNode.style.borderRightStyle = "solid";
					htmlNode.style.borderRightColor = "black";
				}
				if (bNode.childNodes[bsp].nodeName === 'insideH' || bNode.childNodes[bsp].nodeName === 'insideW') {
					htmlNode.style.borderCollapse = "collapse";
				}
			}
		}
		function table(inNode) { // makes TABLE element
			var outNode = newHTMLnode('TABLE');
			tempStr = '';
			for (var j = 0; j < inNode.childNodes.length; j++) {
				var tableChild = inNode.childNodes[j];
				if (tableChild.nodeName === 'tblPr') {
					var tableProperties = tableChild;
					for (var i = 0; i < tableProperties.childNodes.length; i++) {
						var prop = tableProperties.childNodes[i];
						if (prop.nodeName === 'tblBorders') {
							setBorders(outNode, prop);
						}
						if (prop.nodeName === 'tblW') {
							if (prop.getAttribute('w:type') === 'dxa') {
								outNode.style.width = prop.getAttribute('w:w') / 12 + "px";
							}
						}
					}
					if (styleAttrNode = tableChild.getElementsByTagName('jc')[0]) {
						outNode.style.textAlign = styleAttrNode.getAttribute('w:val');
					}
				}
				if (tableChild.nodeName === 'tr') {
					var trNode = newHTMLnode('TR');
					for (var c = 0; c < tableChild.childNodes.length; c++) {
						var cell = tableChild.childNodes[c];
						var tdNode = newHTMLnode('TD');
						for (var cc = 0; cc < cell.childNodes.length; cc++) {
							var cellChild = cell.childNodes[cc];
							if (cellChild.nodeName === 'tcPr') {
								var cellProperties = cellChild;
								for (var k = 0; k < cellProperties.childNodes.length; k++) {
									var trProp = cellProperties.childNodes[k];
									if (trProp.nodeName === 'tcBorders') {
										setBorders(tdNode, trProp);
									}
									if (trProp.nodeName === 'gridSpan') {
										tdNode.colSpan = trProp.getAttribute("w:val");
									}
								}
							}
							if (cellChild.nodeName === 'p') {
								var p = paragraph(cellChild);
								tdNode.appendChild(p);
							}
						}
						trNode.appendChild(tdNode);
					}
					outNode.appendChild(trNode);
				}
			}
			return outNode;
		}
		function toXML(str) { return new DOMParser().parseFromString(str.replace(/<[a-zA-Z]*?:/g, '<').replace(/<\/[a-zA-Z]*?:/g, '</'), 'text/xml').firstChild; }

		if (input.files) { // input is file object
			inputDoc = toXML(input.file('word/document.xml').asText()).getElementsByTagName('body')[0];
			output = newHTMLnode('DIV');
			for (var g = 0; inNode = inputDoc.childNodes[g]; g++) {
				if (inNode.nodeName === 'p') {
					var pNode = paragraph(inNode);
					output.appendChild(pNode);
				}

				/* TODO: Buggy table handler skipped for now.
					It seems to work in certain situations,
					need to narrow down what causes .docx reader to reject. */

				// if (inNode.nodeName === 'tbl') {
				// 	var tNode = table(inNode);
				// 	output.appendChild(tNode);
				// }
			}
			output = output;

		} else if (input.nodeName) { // input is HTML DOM
			doc = new DOMParser().parseFromString('<root></root>', 'text/xml');
			doc.getElementsByTagName('root')[0].appendChild(newXMLnode('body'));
			output = doc.getElementsByTagName('w:body')[0];
			var numberOfLists = 0;
			var linkData = [];
			var riditer = 6;

			var handleInnerNode = function (inNodeChild, outNode) {
				if (inNodeChild.nodeName === 'P' || inNodeChild.nodeName === 'BLOCKQUOTE') {
					for (var h = 0; h < inNodeChild.childNodes.length; h++) {
						handleInnerNode(inNodeChild.childNodes[h], outNode);
					}
				} else {
					var outNodeChild;
					if (inNodeChild.nodeName !== '#text' || inNodeChild.parentNode.nodeName === 'CODE') {
						tempStr = inNodeChild.outerHTML;
						if (inNodeChild.nodeName === 'A') {
							riditer++;
							var linkrid = "rId" + riditer;
							var hyNode = outNode.appendChild(newXMLnode('hyperlink'));
							var tempHref = inNodeChild.getAttribute('href');
							hyNode.setAttribute("r:id", linkrid);
							hyNode.setAttribute("w:history", "1");
							var tempTitle = inNodeChild.getAttribute('title');
							if (tempTitle) {
								hyNode.setAttribute("w:tooltip", tempTitle);
							} else {
								hyNode.setAttribute("w:tooltip", tempHref);
							}
							linkData.push({
								href: tempHref,
								rid: linkrid
							});
							outNodeChild = hyNode.appendChild(newXMLnode('r'));

						// Table
					} else if (inNodeChild.nodeName === 'TH' || inNodeChild.nodeName === 'TD') {
						var tcNode = outNode.appendChild(newXMLnode('tc'));
						var tcPrNode = tcNode.appendChild(newXMLnode('tcPr'));
						tcPrNode.appendChild(newXMLnode('tcW'))
						.setAttribute("w:type", "dxa");
						var tcPNode = tcNode.appendChild(newXMLnode('p'));
						outNodeChild = tcPNode.appendChild(newXMLnode('r'));
						pCount++;

					} else {
						outNodeChild = outNode.appendChild(newXMLnode('r'));
					}

						// styles
						styleAttrNode = outNodeChild.appendChild(newXMLnode('rPr'));
						if (inNodeChild.parentNode.nodeName === 'CODE' || (tempStr && tempStr.indexOf('<code>') > -1)) {

							var fontNode = styleAttrNode.appendChild(newXMLnode('rFonts'));
							fontNode.setAttribute('w:ascii', "Courier");
							fontNode.setAttribute('w:hAnsi', "Courier");
							var shadeNode = styleAttrNode.appendChild(newXMLnode('shd'));
							shadeNode.setAttribute('w:color', "auto");
							shadeNode.setAttribute('w:fill', "EEEEEE");
							shadeNode.setAttribute('val', "clear");
						}
						if (tempStr) {
							if (tempStr.indexOf('<b>') > -1) {
								styleAttrNode.appendChild(newXMLnode('b'));
							}
							if (tempStr.indexOf('<a ') > -1) {
								styleAttrNode.appendChild(newXMLnode('rStyle')).setAttribute('val', 'Hyperlink');
							}
							if (tempStr.indexOf('<strong>') > -1) {
								styleAttrNode.appendChild(newXMLnode('b'));
							}
							if (tempStr.indexOf('<em>') > -1) {
								styleAttrNode.appendChild(newXMLnode('i'));
							}
							if (tempStr.indexOf('<i>') > -1) {
								styleAttrNode.appendChild(newXMLnode('i'));
							}
							if (tempStr.indexOf('<u>') > -1) {
								styleAttrNode.appendChild(newXMLnode('u')).setAttribute('val', 'single');
							}
							if (tempStr.indexOf('<s>') > -1) {
								styleAttrNode.appendChild(newXMLnode('strike'));
							}
							if (tempStr.indexOf('<del>') > -1) {
								styleAttrNode.appendChild(newXMLnode('strike'));
							}
							if (tempStr.indexOf('<sub>') > -1) {
								styleAttrNode.appendChild(newXMLnode('vertAlign')).setAttribute('val', 'subscript');
							}
							if (tempStr.indexOf('<sup>') > -1) {
								styleAttrNode.appendChild(newXMLnode('vertAlign')).setAttribute('val', 'superscript');
							}
							if (tempNode = inNodeChild.nodeName === 'SPAN' ?
								inNodeChild :
								inNodeChild.getElementsByTagName('SPAN')[0]) {

								if (tempNode.style.fontSize) {
									styleAttrNode.appendChild(newXMLnode('sz')).setAttribute('val', parseInt(tempNode.style.fontSize, 10) * 2);

								} else if (tempNode.style.backgroundColor) {
									styleAttrNode.appendChild(newXMLnode('highlight')).setAttribute('val', color(tempNode.style.backgroundColor));

								} else if (tempNode.style.color) {
									styleAttrNode.appendChild(newXMLnode('color')).setAttribute('val', color(tempNode.style.color));
								}
							}
						}
					} else {
						outNodeChild = outNode.appendChild(newXMLnode('r'));
					}
					if (inNodeChild.nodeName === 'BR') {
						outNodeChild.appendChild(newXMLnode('br', inNodeChild.textContent));
					} else {
						outNodeChild.appendChild(newXMLnode('t', inNodeChild.textContent));
					}
				}
			};
			var convertNode = function (inNode, output, listNumber, listDepthNumber) {
				var lists = listNumber || 1;
				var listDepth = listDepthNumber || 0;
				var newPNode = function () {
					outNode = output.appendChild(newXMLnode('p'));
					pCount++;
					return outNode;
				};
				var nName = inNode.nodeName;

				// Skip, should already be appended
				if (nName === '#text') {

				} else {
					var isList = false;
					// Handle List
					if (nName === 'OL' || nName === 'UL') {
						isList = nName;
						if (!listNumber) {
							numberOfLists++;
						}
						var tempNum = listNumber || numberOfLists;
						for (var t = 0; t < inNode.children.length; t++) {
							var inNodeChild = inNode.children[t];
							if (inNodeChild) {
								convertNode(inNodeChild, output, tempNum, listDepth);
							}
						}

					// Table
				} else if (nName === 'TABLE') {
					var tblNode = output.appendChild(newXMLnode('tbl'));
					var tblPrNode = tblNode.appendChild(newXMLnode('tblPr'));
					var tblStyleNode = tblPrNode.appendChild(newXMLnode('tblStyle'));
					tblStyleNode.setAttribute('val', "TableGrid");
					var tblWNode = tblPrNode.appendChild(newXMLnode('tblW'));
					tblWNode.setAttribute('w:type', 'auto');
					tblWNode.setAttribute('w:w', '0');
					var tblLookNode = tblPrNode.appendChild(newXMLnode('tblLook'));
					tblLookNode.setAttribute('w:firstColumn', '1');
					tblLookNode.setAttribute('w:firstRow', '1');
					tblLookNode.setAttribute('w:lastColumn', '0');
					tblLookNode.setAttribute('w:lastRow', '0');
					tblLookNode.setAttribute('w:noHBand', '0');
					tblLookNode.setAttribute('w:noVBand', '1');
					tblLookNode.setAttribute('val', '04A0');
					for (var d = 0; d < inNode.children.length; d++) {
						var inNodeTableChild = inNode.children[d];
						if (inNodeTableChild) {
							convertNode(inNodeTableChild, tblNode, lists, listDepth);
						}
					}

					// Table head
				} else if (nName === 'THEAD') {
					var tblGridNode = output.appendChild(newXMLnode('tblGrid'));
					for (var v = 0; v < inNode.firstElementChild.children.length; v++) {
						tblGridNode.appendChild(newXMLnode('gridCol'));
					}
					if (inNode.firstElementChild) {
						convertNode(inNode.firstElementChild, output, lists, listDepth);
					}
					// Table body
				} else if (nName === 'TBODY') {
					for (var w = 0; w < inNode.children.length; w++) {
						if (inNode.children[w]) {
							convertNode(inNode.children[w], output, lists, listDepth);
						}
					}

					// Regular Node
				} else {
					if (nName === 'TR') {
						outNode = output.appendChild(newXMLnode('tr'));
					} else {
						outNode = newPNode();
					}

						// insert <br>'s into code block
						if (nName === 'PRE') {
							// From Brock Adams at stackoverflow.com
							// http://stackoverflow.com/a/10673260/2601193
							var node = inNode.firstElementChild.childNodes[0];
							var words = node.textContent.split(/\r\n|\r|\n/g);
							var parent = node.parentNode;
							for (var J = 0; J < words.length; ++J) {
								var newWord = document.createTextNode(words[J]);
								parent.insertBefore(newWord, node);
								if (J < (words.length - 1)) {
									var newBreak = document.createElement("br");
									parent.insertBefore(newBreak, node);
								}
							}
							parent.removeChild(node);
							////

							inNode = inNode.firstElementChild;
							var codeNode = outNode.appendChild(newXMLnode('pPr'));
							var shadeNode = codeNode.appendChild(newXMLnode('shd'));
							shadeNode.setAttribute('w:color', "auto");
							shadeNode.setAttribute('w:fill', "EEEEEE");
							shadeNode.setAttribute('val', "clear");
						}

						// textAlign style
						if (inNode.style && inNode.style.textAlign) {
							outNode
							.appendChild(newXMLnode('pPr'))
							.appendChild(newXMLnode('jc'))
							.setAttribute('val', inNode.style.textAlign);
						}

						// header
						if (nName.length == 2 &&
							nName[0] == 'H' &&
							!isNaN(nName[1])) {

							outNode
						.appendChild(newXMLnode('pPr'))
						.appendChild(newXMLnode('pStyle'))
						.setAttribute('val', 'Heading' + nName[1]);

					} else if (nName === 'BLOCKQUOTE') {
						outNode
						.appendChild(newXMLnode('pPr'))
						.appendChild(newXMLnode('pStyle'))
						.setAttribute('val', 'Quote');
					}

						// list item
						if (nName === "LI") {
							var tempOutNodeChild = outNode.appendChild(newXMLnode('pPr'));
							tempOutNodeChild
							.appendChild(newXMLnode('pStyle'))
							.setAttribute('val', "ListParagraph");
							var childChild = tempOutNodeChild
							.appendChild(newXMLnode('numPr'));
							childChild
							.appendChild(newXMLnode('ilvl'))
							.setAttribute('val', listDepth);
							childChild
							.appendChild(newXMLnode('numId'))
							.setAttribute('val', lists.toString());
						}

						for (var j = 0; j < inNode.childNodes.length; j++) {
							var inNodeChild = inNode.childNodes[j];

							// Handle sub-list
							if (inNodeChild.nodeName === 'OL' || inNodeChild.nodeName === 'UL') {
								var newlistDepth = listDepth + 1;
								convertNode(inNodeChild, output, lists, newlistDepth);

							// Ignore empty node
						} else if (inNodeChild.nodeName === '#text' &&
							inNodeChild.nodeValue.length == 1 &&
							inNodeChild.nodeValue.charCodeAt(0) == 10) {

							// Check for node styles
						} else {
							handleInnerNode(inNodeChild, outNode);
						}
					}
				}
			}
		};
		for (var m = 0; m < input.children.length; m++) {
			convertNode(input.children[m], output);
		}
		output = {
			string:			new XMLSerializer().serializeToString(output).replace(/<w:t>/g, '<w:t xml:space="preserve">').replace(/val=/g, 'w:val='),
			charSpaceCount:	input.textContent.length,
			charCount:		input.textContent.replace(/\s/g, '').length,
			pCount:			pCount,
			linkData:		linkData
		};
	}
	return output;
},

read: function (file) {
	var result = {},
	zip = new JSZip(),
	zipTime = Date.now(),
	processTime,
	s;

	try {
		zip = zip.load(file);
	} catch(e) {
		return {error: "Invalid File Type (zip.load)"};
	}
	result.zipTime = Date.now() - zipTime;
	processTime = Date.now();

		//{ Get file info from "docProps/core.xml"
		if (zip.files['docProps/core.xml']) {
			s = zip.files['docProps/core.xml'].asText();

		} else {
			return {error: "Invalid File Type (zip.files)"};
		}

		s = s.substr(s.indexOf('<dc:creator>') + 12);
		result.creator = s.substring(0, s.indexOf('</dc:creator>'));
		s = s.substr(s.indexOf('<cp:lastModifiedBy>') + 19);
		result.lastModifiedBy = s.substring(0, s.indexOf('</cp:lastModifiedBy>'));
		s = s.substr(s.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">') + 43);
		result.created = new Date(s.substring(0, s.indexOf('</dcterms:created>')));
		s = s.substr(s.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">') + 44);
		result.modified = new Date(s.substring(0, s.indexOf('</dcterms:modified>')));
		//}
		result.DOM = this.convertContent(zip);
		result.processTime = Date.now() - processTime;
		return result;
	},

	export: function (DOM, options) {
		var result,
		zip = new JSZip(),
		zipTime,
		processTime = Date.now(),
		docProps,
		word,
		content = this.convertContent(DOM),
		file = options || {};
	//{ Fully static
		zip
		.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default ContentType="image/jpeg" Extension="jpeg"/><Default ContentType="image/jpeg" Extension="jpg"/><Default ContentType="image/gif" Extension="gif"/><Default ContentType="image/png" Extension="png"/><Default ContentType="image/svg+xml" Extension="svg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/stylesWithEffects.xml" ContentType="application/vnd.ms-word.stylesWithEffects+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/webSettings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.webSettings+xml"/><Override PartName="/word/fontTable.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml"/><Override PartName="/word/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>')
		.folder('_rels')
		.file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
		docProps = zip.folder('docProps');

		word = zip.folder('word');
		var refStr = "";
		if (content.linkData.length) {
			for (var s = 0; s < content.linkData.length; s++) {
				refStr += '<Relationship Id="' + content.linkData[s].rid +
				'" Target="' + content.linkData[s].href +
				'" TargetMode="External" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"/>';
			}
		}
		word.folder('_rels')
		.file('document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/><Relationship Id="rId2" Type="http://schemas.microsoft.com/office/2007/relationships/stylesWithEffects" Target="stylesWithEffects.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/webSettings" Target="webSettings.xml"/>' +
			refStr + '</Relationships>');
		word.folder('theme')
		.file('theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS ????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS ??"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>');
		word.file('fontTable.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:fonts xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:font w:name="Calibri"><w:panose1 w:val="020F0502020204030204"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="E10002FF" w:usb1="4000ACFF" w:usb2="00000009" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font><w:font w:name="Times New Roman"><w:panose1 w:val="02020603050405020304"/><w:charset w:val="00"/><w:family w:val="auto"/><w:pitch w:val="variable"/><w:sig w:usb0="E0002AFF" w:usb1="C0007841" w:usb2="00000009" w:usb3="00000000" w:csb0="000001FF" w:csb1="00000000"/></w:font><w:font w:name="Cambria"><w:panose1 w:val="02040503050406030204"/><w:charset w:val="00"/><w:family w:val="roman"/><w:pitch w:val="variable"/><w:sig w:usb0="E00002FF" w:usb1="400004FF" w:usb2="00000000" w:usb3="00000000" w:csb0="0000019F" w:csb1="00000000"/></w:font></w:fonts>')
		.file('settings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:sl="http://schemas.openxmlformats.org/schemaLibrary/2006/main" mc:Ignorable="w14"><w:zoom w:percent="100"/><w:proofState w:spelling="clean" w:grammar="clean"/><w:defaultTabStop w:val="720"/><w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="14"/><w:compatSetting w:name="overrideTableStyleFontSizeAndJustification" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="enableOpenTypeFeatures" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/><w:compatSetting w:name="doNotFlipMirrorIndents" w:uri="http://schemas.microsoft.com/office/word" w:val="1"/></w:compat><w:rsids><w:rsidRoot w:val="00502205"/><w:rsid w:val="00502205"/><w:rsid w:val="00F545DC"/></w:rsids><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="0"/><m:dispDef/><m:lMargin m:val="0"/><m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr><w:themeFontLang w:val="en-US"/><w:clrSchemeMapping w:bg1="light1" w:t1="dark1" w:bg2="light2" w:t2="dark2" w:accent1="accent1" w:accent2="accent2" w:accent3="accent3" w:accent4="accent4" w:accent5="accent5" w:accent6="accent6" w:hyperlink="hyperlink" w:followedHyperlink="followedHyperlink"/><w:shapeDefaults><o:shapedefaults v:ext="edit" spidmax="1026"/><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout></w:shapeDefaults><w:decimalSymbol w:val="."/><w:listSeparator w:val=","/></w:settings>')
		.file('styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles mc:Ignorable="w14" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:cstheme="minorBidi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:bidi="ar-SA" w:eastAsia="en-US" w:val="en-US"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:count="276" w:defLockedState="0" w:defQFormat="0" w:defSemiHidden="1" w:defUIPriority="99" w:defUnhideWhenUsed="1"><w:lsdException w:name="Normal" w:qFormat="1" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0"/><w:lsdException w:name="heading 1" w:qFormat="1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0"/><w:lsdException w:name="heading 2" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 3" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 4" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 5" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 6" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 7" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 8" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="heading 9" w:qFormat="1" w:uiPriority="9"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:qFormat="1" w:uiPriority="35"/><w:lsdException w:name="Title" w:qFormat="1" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:qFormat="1" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0"/><w:lsdException w:name="Strong" w:qFormat="1" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0"/><w:lsdException w:name="Emphasis" w:qFormat="1" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:qFormat="1" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:qFormat="1" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0"/><w:lsdException w:name="Quote" w:qFormat="1" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0"/><w:lsdException w:name="Intense Quote" w:qFormat="1" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:qFormat="1" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0"/><w:lsdException w:name="Intense Emphasis" w:qFormat="1" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Reference" w:qFormat="1" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0"/><w:lsdException w:name="Intense Reference" w:qFormat="1" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0"/><w:lsdException w:name="Book Title" w:qFormat="1" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/><w:lsdException w:name="TOC Heading" w:qFormat="1" w:uiPriority="39"/></w:latentStyles><w:style w:default="1" w:styleId="Normal" w:type="paragraph"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:style><w:style w:styleId="Heading1" w:type="paragraph"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading1Char"/><w:uiPriority w:val="9"/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:after="0" w:before="480"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:styleId="Heading2" w:type="paragraph"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading2Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:after="0" w:before="200"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:styleId="Heading3" w:type="paragraph"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading3Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:after="0" w:before="200"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/></w:rPr></w:style><w:style w:styleId="Heading4" w:type="paragraph"><w:name w:val="heading 4"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading4Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:after="0" w:before="200"/><w:outlineLvl w:val="3"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/><w:i/><w:iCs/></w:rPr></w:style><w:style w:styleId="Heading5" w:type="paragraph"><w:name w:val="heading 5"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading5Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:after="0" w:before="200"/><w:outlineLvl w:val="4"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/></w:rPr></w:style><w:style w:styleId="Heading6" w:type="paragraph"><w:name w:val="heading 6"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="Heading6Char"/><w:uiPriority w:val="9"/><w:unhideWhenUsed/><w:qFormat/><w:pPr><w:keepNext/><w:keepLines/><w:spacing w:after="0" w:before="200"/><w:outlineLvl w:val="5"/></w:pPr><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:i/><w:iCs/></w:rPr></w:style><w:style w:default="1" w:styleId="DefaultParagraphFont" w:type="character"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:default="1" w:styleId="TableNormal" w:type="table"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:type="dxa" w:w="0"/><w:tblCellMar><w:top w:type="dxa" w:w="0"/><w:left w:type="dxa" w:w="108"/><w:bottom w:type="dxa" w:w="0"/><w:right w:type="dxa" w:w="108"/></w:tblCellMar></w:tblPr></w:style><w:style w:default="1" w:styleId="NoList" w:type="numbering"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:customStyle="1" w:styleId="Heading1Char" w:type="character"><w:name w:val="Heading 1 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading1"/><w:uiPriority w:val="9"/><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="Heading2Char" w:type="character"><w:name w:val="Heading 2 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading2"/><w:uiPriority w:val="9"/><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="Heading3Char" w:type="character"><w:name w:val="Heading 3 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading3"/><w:uiPriority w:val="9"/><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="Heading4Char" w:type="character"><w:name w:val="Heading 4 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading4"/><w:uiPriority w:val="9"/><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:b/><w:bCs/><w:i/><w:iCs/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="Heading5Char" w:type="character"><w:name w:val="Heading 5 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading5"/><w:uiPriority w:val="9"/><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="Heading6Char" w:type="character"><w:name w:val="Heading 6 Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Heading6"/><w:uiPriority w:val="9"/><w:rPr><w:rFonts w:ascii="Arial" w:cstheme="majorBidi" w:eastAsiaTheme="majorEastAsia" w:hAnsi="Arial"/><w:i/><w:iCs/></w:rPr></w:style><w:style w:styleId="ListParagraph" w:type="paragraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="34"/><w:qFormat/><w:pPr><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style><w:style w:styleId="BalloonText" w:type="paragraph"><w:name w:val="Balloon Text"/><w:basedOn w:val="Normal"/><w:link w:val="BalloonTextChar"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Lucida Grande" w:hAnsi="Lucida Grande"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="BalloonTextChar" w:type="character"><w:name w:val="Balloon Text Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="BalloonText"/><w:uiPriority w:val="99"/><w:semiHidden/><w:rPr><w:rFonts w:ascii="Lucida Grande" w:hAnsi="Lucida Grande"/><w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr></w:style><w:style w:styleId="Hyperlink" w:type="character"><w:name w:val="Hyperlink"/><w:basedOn w:val="DefaultParagraphFont"/><w:uiPriority w:val="99"/><w:unhideWhenUsed/><w:rPr><w:color w:themeColor="hyperlink" w:val="0000FF"/><w:u w:val="single"/></w:rPr></w:style><w:style w:styleId="Quote" w:type="paragraph"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:link w:val="QuoteChar"/><w:uiPriority w:val="29"/><w:qFormat/><w:rPr><w:i/><w:iCs/><w:color w:themeColor="text1" w:val="000000"/></w:rPr></w:style><w:style w:customStyle="1" w:styleId="QuoteChar" w:type="character"><w:name w:val="Quote Char"/><w:basedOn w:val="DefaultParagraphFont"/><w:link w:val="Quote"/><w:uiPriority w:val="29"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/><w:iCs/><w:color w:themeColor="text1" w:val="000000"/></w:rPr></w:style><w:style w:styleId="TableGrid" w:type="table"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="59"/><w:rsid w:val="00AB1F93"/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:tblPr><w:tblInd w:type="dxa" w:w="0"/><w:tblBorders><w:top w:color="auto" w:space="0" w:sz="4" w:val="single"/><w:left w:color="auto" w:space="0" w:sz="4" w:val="single"/><w:bottom w:color="auto" w:space="0" w:sz="4" w:val="single"/><w:right w:color="auto" w:space="0" w:sz="4" w:val="single"/><w:insideH w:color="auto" w:space="0" w:sz="4" w:val="single"/><w:insideV w:color="auto" w:space="0" w:sz="4" w:val="single"/></w:tblBorders><w:tblCellMar><w:top w:type="dxa" w:w="0"/><w:left w:type="dxa" w:w="108"/><w:bottom w:type="dxa" w:w="0"/><w:right w:type="dxa" w:w="108"/></w:tblCellMar></w:tblPr></w:style></w:styles>')
		.file('stylesWithEffects.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:asciiTheme="minorHAnsi" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="200" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:latentStyles w:defLockedState="0" w:defUIPriority="99" w:defSemiHidden="1" w:defUnhideWhenUsed="1" w:defQFormat="0" w:count="267"><w:lsdException w:name="Normal" w:semiHidden="0" w:uiPriority="0" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 1" w:semiHidden="0" w:uiPriority="9" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="heading 2" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 3" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 4" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 5" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 6" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 7" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 8" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="heading 9" w:uiPriority="9" w:qFormat="1"/><w:lsdException w:name="toc 1" w:uiPriority="39"/><w:lsdException w:name="toc 2" w:uiPriority="39"/><w:lsdException w:name="toc 3" w:uiPriority="39"/><w:lsdException w:name="toc 4" w:uiPriority="39"/><w:lsdException w:name="toc 5" w:uiPriority="39"/><w:lsdException w:name="toc 6" w:uiPriority="39"/><w:lsdException w:name="toc 7" w:uiPriority="39"/><w:lsdException w:name="toc 8" w:uiPriority="39"/><w:lsdException w:name="toc 9" w:uiPriority="39"/><w:lsdException w:name="caption" w:uiPriority="35" w:qFormat="1"/><w:lsdException w:name="Title" w:semiHidden="0" w:uiPriority="10" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Default Paragraph Font" w:uiPriority="1"/><w:lsdException w:name="Subtitle" w:semiHidden="0" w:uiPriority="11" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Strong" w:semiHidden="0" w:uiPriority="22" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Emphasis" w:semiHidden="0" w:uiPriority="20" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Table Grid" w:semiHidden="0" w:uiPriority="59" w:unhideWhenUsed="0"/><w:lsdException w:name="Placeholder Text" w:unhideWhenUsed="0"/><w:lsdException w:name="No Spacing" w:semiHidden="0" w:uiPriority="1" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Light Shading" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 1" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 1" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 1" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 1" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 1" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 1" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Revision" w:unhideWhenUsed="0"/><w:lsdException w:name="List Paragraph" w:semiHidden="0" w:uiPriority="34" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Quote" w:semiHidden="0" w:uiPriority="29" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Quote" w:semiHidden="0" w:uiPriority="30" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Medium List 2 Accent 1" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 1" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 1" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 1" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 1" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 1" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 1" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 1" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 2" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 2" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 2" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 2" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 2" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 2" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 2" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 2" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 2" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 2" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 2" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 2" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 2" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 2" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 3" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 3" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 3" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 3" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 3" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 3" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 3" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 3" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 3" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 3" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 3" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 3" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 3" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 3" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 4" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 4" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 4" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 4" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 4" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 4" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 4" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 4" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 4" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 4" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 4" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 4" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 4" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 4" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 5" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 5" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 5" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 5" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 5" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 5" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 5" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 5" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 5" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 5" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 5" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 5" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 5" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 5" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Shading Accent 6" w:semiHidden="0" w:uiPriority="60" w:unhideWhenUsed="0"/><w:lsdException w:name="Light List Accent 6" w:semiHidden="0" w:uiPriority="61" w:unhideWhenUsed="0"/><w:lsdException w:name="Light Grid Accent 6" w:semiHidden="0" w:uiPriority="62" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 1 Accent 6" w:semiHidden="0" w:uiPriority="63" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Shading 2 Accent 6" w:semiHidden="0" w:uiPriority="64" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 1 Accent 6" w:semiHidden="0" w:uiPriority="65" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium List 2 Accent 6" w:semiHidden="0" w:uiPriority="66" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 1 Accent 6" w:semiHidden="0" w:uiPriority="67" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 2 Accent 6" w:semiHidden="0" w:uiPriority="68" w:unhideWhenUsed="0"/><w:lsdException w:name="Medium Grid 3 Accent 6" w:semiHidden="0" w:uiPriority="69" w:unhideWhenUsed="0"/><w:lsdException w:name="Dark List Accent 6" w:semiHidden="0" w:uiPriority="70" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Shading Accent 6" w:semiHidden="0" w:uiPriority="71" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful List Accent 6" w:semiHidden="0" w:uiPriority="72" w:unhideWhenUsed="0"/><w:lsdException w:name="Colorful Grid Accent 6" w:semiHidden="0" w:uiPriority="73" w:unhideWhenUsed="0"/><w:lsdException w:name="Subtle Emphasis" w:semiHidden="0" w:uiPriority="19" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Emphasis" w:semiHidden="0" w:uiPriority="21" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Subtle Reference" w:semiHidden="0" w:uiPriority="31" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Intense Reference" w:semiHidden="0" w:uiPriority="32" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Book Title" w:semiHidden="0" w:uiPriority="33" w:unhideWhenUsed="0" w:qFormat="1"/><w:lsdException w:name="Bibliography" w:uiPriority="37"/><w:lsdException w:name="TOC Heading" w:uiPriority="39" w:qFormat="1"/></w:latentStyles><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style><w:style w:type="character" w:default="1" w:styleId="DefaultParagraphFont"><w:name w:val="Default Paragraph Font"/><w:uiPriority w:val="1"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style><w:style w:type="numbering" w:default="1" w:styleId="NoList"><w:name w:val="No List"/><w:uiPriority w:val="99"/><w:semiHidden/><w:unhideWhenUsed/></w:style><w:style w:styleId="ListParagraph" w:type="paragraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:uiPriority w:val="34"/><w:qFormat/><w:rsid w:val="00962877"/><w:pPr><w:ind w:left="720"/><w:contextualSpacing/></w:pPr></w:style></w:styles>')
		.file('webSettings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:webSettings xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" mc:Ignorable="w14"><w:optimizeForBrowser/><w:allowPNG/></w:webSettings>');

		//}
		//{ Not content dependent
			docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>' +
				(file.creator || 'DOCX.js') +
				'</dc:creator><cp:lastModifiedBy>' +
				(file.lastModifiedBy || 'XLSX.js') +
				'</cp:lastModifiedBy><cp:revision>1</cp:revision><dcterms:created xsi:type="dcterms:W3CDTF">' +
				(file.created || new Date()).toISOString() +
				'</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' +
				(file.modified || new Date()).toISOString() +
				'</dcterms:modified></cp:coreProperties>');
		//}
		//{ Content dependent
			//{ docProps/app.xml
				docProps.file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Template>Normal.dotm</Template><TotalTime>1</TotalTime><Pages>1</Pages><Words>1</Words><Characters>' +
					content.charCount +
					'</Characters><Application>DOCX.js</Application><DocSecurity>0</DocSecurity><Lines>1</Lines><Paragraphs>' +
					content.pCount +
					'</Paragraphs><ScaleCrop>false</ScaleCrop><Company>Microsoft Corporation</Company><LinksUpToDate>false</LinksUpToDate><CharactersWithSpaces>' +
					content.charSpaceCount +
					'</CharactersWithSpaces><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');
			//}

			word.file('document.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14"><w:body>' +
				content.string +
				'<w:sectPr w:rsidR="00F545DC" w:rsidRPr="00502205"><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="720"/><w:docGrid w:linePitch="360"/></w:sectPr></w:body></w:document>');
		//}
		processTime = Date.now() - processTime;
		zipTime = Date.now();
		result = {
			blob: zip.generate({
				compression: 'DEFLATE',
				type: 'blob'
			}),
			zipTime: Date.now() - zipTime,
			processTime: processTime,

			/* TODO: Handle older browsers (ie) without blobURL support */
			href: function () {
				if (!this.blobURL) {
					var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL;
					this.blobURL = createObjectURL(this.blob);
				}
				return this.blobURL;
			},
			revoke: function () {
				var revokeObjectURL = (window.URL || window.webkitURL || {}).revokeObjectURL || function () {};
				revokeObjectURL(this.blobURL);
				this.blobURL = null;
			}
		};
		return result;
	}
};
