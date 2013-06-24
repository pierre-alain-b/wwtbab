var game;

function reloadGif(tags)
{
	$(tags).each(function (i) {
		$(this).css("background-image", $(this).css("background-image").replace(/^(url\([^#]*).*\)$/, '$1#' + Math.random().toString() + ')'));
	});
}

function removeLocalOverride(tags)
{
	$(tags).each(function (i) {
		$(this).css("background-image", "");
	});
}

function CGame() { this.construct(); }
CGame.prototype = {

		mGameProgress: 0, //5
		mQuestionNumber: 0,
		mGameHandlerCall: function (p) { game.gameHandler(p); },
		mNextAfterKey: false,
		mCurrentAbort: null,
		mBgSound: null,
		mLastAnswer: null,
		mFiftyFifty: null,
		mPendingAudience: false,
		mPendingTelephone: false,
		mJokersUsed: {fiftyfifty: false, audience: false, telephone: false},

		construct: function()
		{
			$(document).ready(function() {
				game.gameHandler(this);
				$(".answer").fitText();
				$(".questionbar").fitText();
				$(".answer, .joker").click(function (t) {
					if(game.mNextAfterKey)
					{
						game.gameHandler(t);
					}
				});
			});
			$(document).keypress(function(evt) { game.keyHandler(evt); });
			$(document).mouseup(function(evt) { game.mouseHandler(evt); });
		},

		joker5050: function()
		{
			if(this.mJokersUsed.fiftyfifty)
				return;

			$("#joker5050").addClass("joker5050-used");
			var a = new Audio("sounds/joker/Track_37.ogg");
			a.play();

			this.mFiftyFifty = [];
			var r1, r2, arr;
			arr = ["A", "B", "C", "D"];
			do
			{
				r1 = (Math.floor(Math.random() * (4 - 0)) + 0);
			}
			while(arr[r1] == questions[this.mQuestionNumber].correctAnswer);

			do
			{
				r2 = (Math.floor(Math.random() * (4 - 0)) + 0);
			}
			while((arr[r2] == questions[this.mQuestionNumber].correctAnswer) || (r2 == r1));
			this.mFiftyFifty.push(arr[r1]);
			this.mFiftyFifty.push(arr[r2]);

			$("#answer" + this.mFiftyFifty[0]).addClass("answer-hidden");
			$("#answer" + this.mFiftyFifty[1]).addClass("answer-hidden");
			removeLocalOverride("#answer" + this.mFiftyFifty[0] + ", #answer" + this.mFiftyFifty[1]);
			reloadGif("#answer" + this.mFiftyFifty[0] + ", #answer" + this.mFiftyFifty[1]);

			this.mJokersUsed.fiftyfifty = true;

      //changing background sound
			this.mBgSound.pause();
			this.mBgSound = new Audio("sounds/bgloops/Track_101_loop.ogg");
			this.mBgSound.loop = true;
      this.mBgSound.play();

		},

		jokerTelephone: function()
		{
			if(this.mJokersUsed.telephone)
				return;

      this.mBgSound.pause();
			var a = new Audio("sounds/joker/Track_42_loop.ogg");
			a.play();
			this.mBgSound = new Audio("sounds/joker/Track_39_loop.ogg");
			this.mBgSound.loop = true;
      this.mBgSound.play();
      this.mPendingTelephone=true;

			var q = $("#proofscreen");
			//load image and show afterwards
			$("#proofimg", q).attr("src", "images/telephone-active.png").load(function() {q.fadeIn();});
		},

		jokerAudience: function()
		{
			if(this.mJokersUsed.audience)
				return;

      this.mBgSound.pause();
			var a = new Audio("sounds/joker/Track_39.ogg");
			a.play();
			this.mBgSound = new Audio("sounds/joker/Track_39_loop.ogg");
			this.mBgSound.loop = true;
      this.mBgSound.play();
      this.mPendingAudience=true;

			var q = $("#proofscreen");
			//load image and show afterwards
			$("#proofimg", q).attr("src", "images/audience-active.png").load(function() {q.fadeIn();});


		},

		gameHandler: function(param)
		{
			switch(this.mGameProgress)
			{
			case 0: //click to start thingie
				{
				$("#clickToStart a").click(function () {
		      game.mGameProgess++;
					game.gameHandler(game);
				});
				this.mNextAfterKey = false;
				break;
				}
			case 1: //show intro video
				{
					$("#introvideo").show();
					console.log("gh");
					var v = $("#introvideo video").get(0);
					v.play();
					v.addEventListener("ended", this.mGameHandlerCall, false);

					this.mNextAfterKey = true;//true
					this.mCurrentAbort = function() {
						v.pause();
					}
					break;
				}
			case 2: //show titlescreen
				{
					$("#titlescreen").show();

					this.mBgSound = new Audio("sounds/bgloops/Track_5_loop.ogg");
					this.mBgSound.loop = true;
					this.mBgSound.play();

					this.mNextAfterKey = true;
					this.mCurrentAbort = null;
					break;
				}
			case 3: //show studio screen
				{
					this.mBgSound.pause();
					this.mBgSound = new Audio("sounds/bgloops/Track_12_FF_loop.ogg");
					this.mBgSound.loop = true;
					this.mBgSound.play();

					$("#transition_studio_screen").fadeIn(1000);

					this.mNextAfterKey = true;
					this.mCurrentAbort = null;
					break;
				}
			case 4: //zoom to candidate-computer-screen
				{
					this.mBgSound.pause();
					var a = new Audio("sounds/beginquestion/Track_20.ogg");
					a.play();
					a.addEventListener("ended", function () { game.mBgSound.play(); }, false);


					$("#transition_studio_screen img").hide();
					v = $("#transition_studio_screen video");
					v.show();
					v = v.get(0);
					v.play();
					v.addEventListener("ended", this.mGameHandlerCall, false);

					this.mNextAfterKey = false;
					this.mCurrentAbort = null;
					break;
				}
			case 5: //begin new question
				{
					//reset all the class tags
					$("#answerA").removeClass().addClass("answer");
					$("#answerB").removeClass().addClass("answer");
					$("#answerC").removeClass().addClass("answer");
					$("#answerD").removeClass().addClass("answer");
					$("#questionbar").addClass("questionbar");

					//reset class tags for jokers
					if(this.mJokersUsed.audience) $("#jokeraudience").addClass("jokeraudience-strokeout");
					else $("#jokeraudience").removeClass().addClass("jokeraudience-active");
					if(this.mJokersUsed.telephone) $("#jokertelephone").addClass("jokertelephone-strokeout");
					else $("#jokertelephone").removeClass().addClass("jokertelephone-active");
					if(this.mJokersUsed.fiftyfifty) $("#joker5050").addClass("joker5050-strokeout");
					else $("#joker5050").removeClass().addClass("joker5050-active");

					var q = $("#questionscreen");
					//hide answers
					$(".answertext, .questiontext", q).hide();

					//show screencontent
					q.show();

					removeLocalOverride(".answer, .questionbar");
					reloadGif(".answer, .questionbar");

          //changing sound
			    this.mBgSound.pause();
			    this.mBgSound = new Audio("sounds/bgloops/Track_101_loop.ogg");
			    this.mBgSound.loop = true;
          this.mBgSound.play();

					//set question and answer-texts
					$(".questiontext", q).html(questions[this.mQuestionNumber].question);
					$("#answerA .answertext", q).html("A: " + questions[this.mQuestionNumber].answerA);
					$("#answerB .answertext", q).html("B: " + questions[this.mQuestionNumber].answerB);
					$("#answerC .answertext", q).html("C: " + questions[this.mQuestionNumber].answerC);
					$("#answerD .answertext", q).html("D: " + questions[this.mQuestionNumber].answerD);

					if(questions[this.mQuestionNumber].questionsize)
						$(".questiontext", q).css("font-size", questions[this.mQuestionNumber].questionsize);
					else
						$(".questiontext", q).css("font-size", "");

					if(questions[this.mQuestionNumber].answersize)
						$(".answertext", q).css("font-size", questions[this.mQuestionNumber].answersize);
					else
						$(".answertext", q).css("font-size", "");

					//show them after gif-animation again
					setTimeout(function ()
							{
								game.mNextAfterKey = true; //only keys a,b,c,d, see case 6
								$(".answertext, .questiontext", q).show();
								$(window).resize(); //makes sure fittext works
							}, 2000);

					this.mNextAfterKey = false; //after questions pop up and only keys a,b,c,d, see case 6
					this.mCurrentAbort = null;
					break;
				}
			case 6: //handle user clicks, keypresses, select questions/jokers
				{
					this.mLastAnswer = null;

        //Intercepting the event in after the audience joker
        if(this.mPendingAudience) { // mPendingAudience is true if the audience jocker was in use
			    $("#jokeraudience").addClass("jokeraudience-used");
			    this.mJokersUsed.audience = true;
			    this.mBgSound.pause();
			    this.mBgSound = new Audio("sounds/bgloops/Track_101_loop.ogg"); //switch back to the question bg sound
			    this.mBgSound.loop = true;
          this.mBgSound.play();
          this.mPendingAudience = false;
          $("#proofscreen").hide();
			    return;
        }

        //Intercepting the event in after the audience joker
        if(this.mPendingTelephone) { // mPendingTelephone is true if the telephone jocker was in use
			    $("#jokertelephone").addClass("jokertelephone-used");
			    this.mJokersUsed.telephone = true;
			    this.mBgSound.pause();
			    this.mBgSound = new Audio("sounds/bgloops/Track_101_loop.ogg"); //switch back to the question bg sound
			    this.mBgSound.loop = true;
          this.mBgSound.play();
          this.mPendingTelephone = false;
          $("#proofscreen").hide();
			    return;
        }


					if(param.currentTarget.id) //mouse hit object
					{
						switch(param.currentTarget.id) //which object?
						{
						case 'joker5050':		this.joker5050();		return;
						case 'jokertelephone':	this.jokerTelephone();	return;
						case 'jokeraudience':	this.jokerAudience();	return;

						case 'answerA':
						case 'answerB':
						case 'answerC':
						case 'answerD':
							this.mLastAnswer = param.currentTarget.id;
							break; //notice: break only here ...
						default:
							return;
						}
					}
					else if(param.which) //keycode
					{
						var key = String.fromCharCode(param.which).toLowerCase();
						switch (key)
						{
						case 'a': this.mLastAnswer = 'answerA'; break;
						case 'b': this.mLastAnswer = 'answerB'; break;
						case 'c': this.mLastAnswer = 'answerC'; break;
						case 'd': this.mLastAnswer = 'answerD'; break;
						case '1': this.joker5050();			return;
						case '2': this.jokerTelephone();	return;
						case '3': this.jokerAudience();		return;
						default:
							return; //unknown key pressed
						}
					}

					if(this.mLastAnswer == null)
						return;

					if((this.mFiftyFifty != null) && (("answer" + this.mFiftyFifty[0] == this.mLastAnswer) || ("answer" + this.mFiftyFifty[1] == this.mLastAnswer)))
						return;

					this.mFiftyFifty = null;

					//check mouseobject
					//if((this.mLastAnswer != 'answerA') && (this.mLastAnswer != 'answerB') && (this.mLastAnswer != 'answerC') && (this.mLastAnswer != 'answerD'))
//						return;

					//stop questionsound
					if(this.mBgSound)
						this.mBgSound.pause();

					//mark selected answer yellow
					removeLocalOverride("#questionscreen #" + this.mLastAnswer);
					$("#questionscreen #" + this.mLastAnswer).addClass("answerYellow");

					//prepare new sound ("waiting for right or wrong")
					this.mBgSound = new Audio("sounds/bgloops/Track_12_loop.ogg");
					this.mBgSound.loop = true;

					//play "answer locked" sound & play prepared sound afterwards
					var a = new Audio("sounds/lockquestion/Track_12.ogg");
					a.play();
					a.addEventListener("ended", function () {
						if(game.mGameProgress == 7)
							if(game.mBgSound)
								game.mBgSound.play();
					}, false);

					//press key to show right or wrong
					this.mNextAfterKey = true;
					this.mCurrentAbort = null;
					break;
				}
			case 7: //evaluate answer
				{
					//get correct answer-tag
					var correctElement = $("#questionscreen #" + 'answer' + questions[this.mQuestionNumber].correctAnswer);
					//remove yellow-class (if it is there)
					correctElement.removeClass("answerYellow");
					//set it to blinking green
					setTimeout(function () {
						correctElement.addClass("answerGreenBlue");
					}, 1); //hack to make ff show animation
					removeLocalOverride(correctElement);
					reloadGif(correctElement);

					//stop background sound
					if(this.mBgSound)
					{
						this.mBgSound.pause();
					}
					//prepare new background sound (watching solution)
					this.mBgSound = new Audio("sounds/bgloops/Track_12_FF_loop.ogg");
					this.mBgSound.loop = true;

					//check if question has been answered correctly & play corresponding sound
					var b;
					if(this.mLastAnswer == ('answer' + questions[this.mQuestionNumber].correctAnswer))
					{
						//correct
						//Track 128 Sting.ogg
						b = new Audio("sounds/right&wrong/Track_128_Sting.ogg");
						questions[this.mQuestionNumber]['answeredCorrect'] = true;
						$("#barOnTheRight").append('<img src="images/heart.png" />');
					}
					else
					{
						//incorrect
						//Track 127 Sting.ogg
						b = new Audio("sounds/right&wrong/Track_127_Sting.ogg");
						questions[this.mQuestionNumber]['answeredCorrect'] = false;
						$("#barOnTheRight").append('<img src="images/heart-broken.png" />');
					}
					b.play();
					//wait for sound to end, then play prepared bg-sound
					//and show proof after playing sound
					b.addEventListener("ended", function () {
						if(game.mBgSound)
							game.mBgSound.play();

							if(typeof game.mCurrentAbort == 'function')
								game.mCurrentAbort();
							game.gameHandler();
					}, false);

					this.mNextAfterKey = false;
					this.mCurrentAbort = null;
					break;
				}
//			case 8: //just wait
//				{
//					this.mNextAfterKey = true;
//					this.mCurrentAbort = null;
//					break;
//				}
			case 8: //show proof image
				{
					var q = $("#proofscreen");
					//load image and show afterwards
					$("#proofimg", q).attr("src", questions[this.mQuestionNumber].imageLink).load(function() {q.fadeIn();});

					this.mNextAfterKey = true;
					this.mCurrentAbort = null;
					break;
				}
			case 9: //restart quiz with next question
				{
					this.mQuestionNumber++;
					if(this.mQuestionNumber < questions.length) //as long as questions are available
					{
						this.mGameProgress = 5; //restart game
						//cleanup
						$("#proofscreen").hide();


						this.mBgSound.pause();
						var a = new Audio("sounds/beginquestion/Track_20.ogg");
						a.play();
						a.addEventListener("ended", function () { game.mBgSound.play(); }, false);

						this.gameHandler();
						return;
					}
					//NO BREAK!
				}
			case 10: //show end-game-image
				{
					//hide everything
					$("#introvideo, #titlescreen, #transition_studio_screen, #questionscreen, #proofscreen").hide();
					//show finish
					$("#finalscreen").show();

					//stop background sound
					if(this.mBgSound)
					{
						this.mBgSound.pause();
						this.mBgSound = null;
					}

					this.mBgSound = new Audio("sounds/intro&outro/Track_40.ogg");
					this.mBgSound.play();

					this.mNextAfterKey = false;
					this.mCurrentAbort = null;
					break;
				}
			}
			this.mGameProgress++;
		},

		keyHandler: function(event)
		{
			if(game.mNextAfterKey)
			{
				if(typeof game.mCurrentAbort == 'function')
					game.mCurrentAbort();
				game.gameHandler(event);
			}
		},

		mouseHandler: function(event)
		{
			if(game.mNextAfterKey)
			{
				if(typeof game.mCurrentAbort == 'function')
					game.mCurrentAbort();
				game.gameHandler(event);
			}
		}
};

game = new CGame();
