wwtbab - Who Wants to Be a Bridegroom
=====================================

What is it?
===========
wwtbab is a game for wedding partys. It basically works like "Who Wants to Be a Millionaire" (wwtbam) the famous tv-show, but with some differences:
The candidate is always the bridegroom and he answers questions about his bride, her family, her friends, etc.
But the game doesn't let him loose if he answers a question wrong, instead he earns "hearts" for right answers and "broken hearts" for wrong answers and gets to the next question - no matter what he answered before. After each question an image of proof for the correctnes of the answer is shown, e.g. "what was her favorite haircolour when she was 15?" and you get to see an image of proof about what colour it was. The more embarassing the picture is, the more fun for the audience ;)
He will also have the classic-jokers (telephone, 50:50, ask-the-audience) for answering the questions. Most of them have to be done by the questmaster - so the game is unable to "call your friend" or "ask the audience". Only the 50:50 joker works as usual.

The intention in writing this game was to get the atmosphere of the wwtbam show to the wedding party. Everyone should have fun guessing and watching the show.

This game has already been presented at two weddings with more or less great success, so I was asked to publish it. 
But there is a little problem with that - I am not an artist, just a computer science student, so I borrowed all the artwork from an original wwtbam game that has been released in the year 2000 by Eidos. You can find it via Amazon:
http://amazon.de/dp/B00004YW1B
That means, I am releasing the code for the game, but not the artwork (images, animations, sounds, videos). The code of the tools I used for the extraction of the data from the original game is also contained in this repository. So you are not getting the finished product - you have to do the artwork yourself or extract it from your original version of the wwtbam game before you are able to play it.

But if you want to do your own artwork, feel free to contribute it to this project ;)

Things you should know about wwtbab.
====================================
wwtbab ...
- is released under the BSD license, you can find in LICENSE.txt.
- is written in html, css and javascript. It is not exactly what one would call "an example of good code" due to it has been written in haste.
- requires a fixed aspect ratio of 4:3 as most of the current video projectors I know (which are usually old) have this aspect ratio. Furthermore the original wwtbam had this fixed aspect ratio, so all fullscreen images had the same.
- is best experienced using the fullscreenmode of your browser.
- worked best with Firefox 13, Chrome hat some problems with non-replaying-gifs I wasn't able to work around and IE isn't recommendable. But I never tried Safari or Opera ...
- will need jquery and fittext (see source section for urls).


Source
======
Some descriptions about the games source files.
You can ignore ".empty" files, they just make git keep the folder.

Folders:
- FitText:
  Needed for resolution independent text size (in relation to the screen resolution)
  Grab a copy from https://github.com/davatron5000/FitText.js
- images:
  still and animated pictures
  Read README-img.txt for contents of the pictures.
  How to get them?
    Modify the path in the wwm_egg_unpack.cpp file so it points at the "\Data\Screens\BEEgg.egg" file of your wwtbam installation, then compile	and execute.
- sounds:
  everything making noise ;)
  How to get them?
    Modify the path in the wwm_awf_unpack.cpp file so it points at the "\Data\sfx\audio.awf" file of your wwtbam installation, then compile and	execute.
  just sort the sounds in according to the names listed in README-snd.txt
- videos:
  prerendered videos from wwtbam
  How to get them?
    Get those bink-tools and convert the bik or whatever files from wwtbam to some format your browser can play - I used VP80 & Vorbis in a webm container.
  Read README-vid.txt for required videos.
- wwtbam extractors:
  The extraction tools source mentioned earlier. Not needed for the game.
  Originally compiled with msvc - you might need to rewrite some compiler directives if you use a different compiler.
  
Important files:
- wwtbab.html:
  this is the "game" itself, open it with a browser.
- jquery-1.7.2.min.js:
  get it from http://jquery.com/
  Newer versions could also work ...
- questions.js:
  this file contains the questions in a json-format.
  Use answersize and questionsize to size questions manually if they dont fit.
  You have to "bruteforce" some percentual values usually between 25% and 50% to get the job done.
- scripts.js
  this file contains the "logic" behind the game.
  The gameHandler method of the CGame class contains the important things.
  It is built like a mad state-machine which runs through 12 states:
    0: Startupscreen displaying "click here to start ..."
	1: intro video
	2: titlescreen (still image)
	3: studioscreen (still image)
	4: zoom from studio screen to candidate computer screen screen :D (video)
	5: new question, show questionscreen, play music, show questions, etc.
	6: waits for click on an answer or a joker. You can use the keys a, b, c or d for selecting a question or click on it with your lmb. You can use 1, 2 and 3 for 50:50, telephone an audience joker or click on its symbol with your lmb. Plays "answer has been set" sound and waits for another click (so the questmaster can do his tension thing).
	7: plays right or wrong sound and continues automatically to 8 when finished
	8: fade out the question and continue to 9 when finished
	9: show the proofimage for the current question
	10: restart quiz with next question if available (goto 5), else next (goto 11)
	11: show end-game-image and play the epic wwtbam winner sound ;)


Final things
============
- Why html/css7js?
  I don't know flash and didn't have the time to learn it ;)
- What if it doesn't work?
  Fix it yourself ;)
- This game is buggy like hell!
  So you got a lot of work to do ;)
- Can't you give me the artwork? I won't share!
  No.
- Can I contact you for help?
  You can, but please don't. If you do, there is almost no chance of getting an answer.
- How to find errors and problems?
  Get Browserplugins like FireBug or Webdeveloper (Firefox) and a proper IDE like Netbeans, Eclipse, etc.
  
- DON'T BLAME ME IF THIS DOES NOT WORK ON YOUR WEDDING PARTY!