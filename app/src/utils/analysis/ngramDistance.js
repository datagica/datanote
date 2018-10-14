
/**
 * Compute the distances between words inside a document (ie. ngram list)
 *
 * ngrams: Array<NGram>   - an array of ngrams, sorted by position in the sentence
 * minDistance: Number    - cut the list if score is below a certain threshold
 *
 */
export default function ngramDistance(ngrams, minDistance = 10){

	// prepare ngrams
	/*
	{
		"ngram": "Le terroriste, James Name One, a été abattu",
		"value": {
			"id": "james-name-one",
			"label": {
				"en": "James Name One"
			},
			"position": "terroriste",
			"status": "killed"
		},
		"score": 1,
		"position": {
			"substring": {
				"begin": 0,
				"end": 43
			},
			"fullstring": {
				"begin": 0,
				"end": 43
			}
		}
	}
	*/


	let ngram1, ngram2, distance;
	const edges = [];

	for (let i = 0; i < ngrams.length && ngrams[i]; i++) {
		ngram1 = ngrams[i];
		//console.log("\nngram1: ", ngram1);
		for (
			let j = i - 1
    ;
			(j > 0) &&
			(ngram2 = ngrams[j]) &&
			(distance = ngram1.position.substring.begin - ngram2.position.substring.end)
    ;
			j--
		) {
			//console.log("  - searching left: ", ngram2);
			//console.log("  - searching left --> distance is ", distance);
			edges.push({
				from: ngram1,
				to: ngram2,
				weight: distance
			})
		}
		for (
			let j = i + 1
		;
		  (j < ngrams.length) &&
		  (ngram2 = ngrams[j]) &&
      (distance = ngram2.position.substring.begin - ngram1.position.substring.end)
		;
		j++
	  ) {
			//console.log("  - searching right: ", ngram2);
			//console.log("  - searching left --> distance is ", distance);
			edges.push({
				from: ngram1,
				to: ngram2,
				weight: distance
			})
		}
	}

	return edges;
}
