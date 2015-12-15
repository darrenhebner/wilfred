var app = new Vue ({
	el: "#app",

	data: {
		loadingMessage: "",
		corpus: "",
		searchQuery: "",
		topics: [],
        food: [],
        music: [],
        sports: [],
        programmingLanguage: [],
        homeView: true,
        resultsView: false,
        aboutView: false
	},

	methods: {
		getTweets: function() {
			var _this = this;
			var twitterEndpoint = 'php/get_tweets.php?username=' + _this.searchQuery;
			_this.loadingMessage = "is researching";

		    this.$http.get(twitterEndpoint, function (data, status, request) {

		    	var corpus = "";

                for (var i = 0; i < data.length; i++) {
                    corpus += " " + data[i].text;
                }

				corpus = corpus.replace(/(https?:\/\/[^\s]+)/g, '');//remove links
				corpus = corpus.replace(/[^a-zA-Z ]/g, "");//remove everything but letters
				corpus = corpus.replace(/RT/g,''); // remove RT
				corpus = corpus.toLowerCase(); // make lowercase
				corpus = corpus.removeStopWords();

				_this.$set('corpus', corpus);
				_this.loadingMessage = "is analyzing";
				_this.getAnalysis();

		    }).error(function (data, status, request) {
		         console.log(data + status);
		    })
		},
		getAnalysis: function(){
			var _this = this;
			var topics = [];
			var textSearchURL = 'php/analyze.php?corpus=' + this.corpus;
			var food = [];
			var music = [];
            var sports = [];
            var programmingLanguage = [];

			this.$http.get(textSearchURL, function (data, status, request) {

                // pull topics from data
                for (var i = 0; i < data.response.topics.length; i++) {
                    if (data.response.topics[i].score > 0.9) {
                        topics.push(data.response.topics[i].label);
                    };
                }

                // pull musicial artists from data
				for (var j = 0; j < data.response.entities.length; j++) {
					if (data.response.entities[j].confidenceScore > 0 && data.response.entities[j].type) {
				 		for (var k = 0; k < data.response.entities[j].type.length; k++) {
				 			if (data.response.entities[j].type[k] == "MusicalArtist") {
				 				music.push(data.response.entities[j].entityId);
				 			}
				 		}
				 	}
				};

                for (var j = 0; j < data.response.entities.length; j++) {
                    if (data.response.entities[j].confidenceScore > 1 && data.response.entities[j].type) {
                        for (var k = 0; k < data.response.entities[j].type.length; k++) {
                            if (data.response.entities[j].type[k] == "Food") {
                                food.push(data.response.entities[j].entityId);
                            }
                        }
                    }
                };

                for (var j = 0; j < data.response.entities.length; j++) {
                    if (data.response.entities[j].confidenceScore > 1 && data.response.entities[j].type) {
                        for (var k = 0; k < data.response.entities[j].type.length; k++) {
                            if (data.response.entities[j].type[k] == "SportsEvent" || data.response.entities[j].type[k] == "Sport" || data.response.entities[j].type[k] == "SportsLeague") {
                                sports.push(data.response.entities[j].entityId);
                            }
                        }
                    }
                };

                for (var j = 0; j < data.response.entities.length; j++) {
                    if (data.response.entities[j].confidenceScore > 1 && data.response.entities[j].type) {
                        for (var k = 0; k < data.response.entities[j].type.length; k++) {
                            if (data.response.entities[j].type[k] == "ProgrammingLanguage") {
                                programmingLanguage.push(data.response.entities[j].entityId);
                            }
                        }
                    }
                };

				_this.loadingMessage = "";
				_this.$set('music', music);
                _this.$set('food', food);
				_this.$set('topics', topics);
                _this.$set('sports', sports);
                _this.$set('programmingLanguage', programmingLanguage);
                _this.homeView = false;
                _this.resultsView = true;

                var searchContainer = document.querySelector(".search__container");
                var transformContainer = document.querySelector(".transform__container");
                var resultContainer = document.querySelector(".result__container");

                searchContainer.className = searchContainer.className + " fadeOut";
                resultContainer.className = resultContainer.className + " expand"
                transformContainer.className = transformContainer.className + " moveUp";

		    }).error(function (data, status, request) {
		        console.log(data + status);
		    })

		}
	},
    computed: {
        blurb: function() {
            var sentence = "";

            if (this.topics.length > 0) {
                sentence += this.searchQuery + " is interested in ";
                if (this.topics.length == 1) {
                    sentence += this.topics[0] + ". ";
                } else {
                    for (var i = 0; i < this.topics.length; i++) {
                        if (i < this.topics.length - 1) {
                            sentence += this.topics[i] + ", ";
                        } else {
                            sentence += " and " + this.topics[i] + ". ";
                        }
                    }
                }
            }   

            if (this.music.length > 0) {
                sentence += "They like to listen to ";
                if (this.music.length == 1) {
                    sentence += this.music[0] + ". ";
                } else {
                    for (var i = 0; i < this.music.length; i++) {
                        if (i < this.music.length - 1) {
                            sentence += this.music[i] + ", ";
                        } else {
                            sentence += " and " + this.music[i] + ". ";
                        }
                    }
                }
            }

            if (this.food.length > 0) {
                sentence += "They like to eat ";
                if (this.food.length == 1) {
                    sentence += this.food[0] + ". ";
                } else {
                    for (var i = 0; i < this.food.length; i++) {
                        if (i < this.food.length - 1) {
                            sentence += this.food[i] + ", ";
                        } else {
                            sentence += " and " + this.food[i] + ". ";
                        }
                    }
                }
            }

            if (this.sports.length > 0) {
                sentence += "They like ";
                if (this.sports.length == 1) {
                    sentence += this.sports[0] + ". ";
                } else {
                    for (var i = 0; i < this.sports.length; i++) {
                        if (i < this.sports.length - 1) {
                            sentence += this.sports[i] + ", ";
                        } else {
                            sentence += " and " + this.sports[i] + ". ";
                        }
                    }
                }
            }

            if (this.programmingLanguage.length > 0) {
                sentence += "They like to program with ";
                if (this.programmingLanguage.length == 1) {
                    sentence += this.programmingLanguage[0] + ". ";
                } else {
                    for (var i = 0; i < this.programmingLanguage.length; i++) {
                        if (i < this.programmingLanguage.length - 1) {
                            sentence += this.programmingLanguage[i] + ", ";
                        } else {
                            sentence += " and " + this.programmingLanguage[i] + ". ";
                        }
                    }
                }
            }

            return sentence;
        }
    }
})

String.prototype.removeStopWords = function() {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = this.valueOf();
    var stop_words = new Array(
        'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'car',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'i',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'like',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'point',
        'pointed',
        'pointing',
        'points',
        'possible',
        'present',
        'presented',
        'presenting',
        'presents',
        'problem',
        'problems',
        'put',
        'puts',
        'q',
        'quite',
        'r',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'small',
        'smaller',
        'smallest',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'thought',
        'thoughts',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'twitter',
        'u',
        'under',
        'until',
        'up',
        'upon',
        'us',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'working',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yes',
        'yet',
        'you',
        'young',
        'younger',
        'youngest',
        'your',
        'yours',
        'z'
    )
         
    // Split out all the individual words in the phrase
    words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
 
    // Review all the words
    for(x=0; x < words.length; x++) {
        // For each word, check all the stop words
        for(y=0; y < stop_words.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
             
            // Get the stop word
            stop_word = stop_words[y];
             
            // If the word matches the stop word, remove it from the keywords
            if(word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
                regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
                regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
                regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
             
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}