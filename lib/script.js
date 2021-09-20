// Define study
const study = lab.util.fromObject({
  "title": "root",
  "type": "lab.flow.Sequence",
  "parameters": {},
  "plugins": [
    {
      "type": "lab.plugins.Metadata",
      "path": undefined
    },
    {
      "type": "lab.plugins.PostMessage",
      "path": undefined
    }
  ],
  "metadata": {
    "title": "Learning Task",
    "description": "",
    "repository": "",
    "contributors": ""
  },
  "messageHandlers": {},
  "files": {},
  "responses": {},
  "content": [
    {
      "type": "lab.flow.Sequence",
      "files": {
        "1a.bmp": "embedded\u002F44f3ded6abd5907de4764e09495c08eb6e3731f9cb0f3bef2d849fb9d823b306.bmp",
        "1b.bmp": "embedded\u002F7da68e6491d67c5e0c8a045bf81293fa843f275ed2fd9a9b99d9be9d01cd0e2d.bmp",
        "2a.bmp": "embedded\u002F947a07b0c9148116ffb12a45020efad6591f95ef9282fbbcb166df2c51ec5689.bmp",
        "2b.bmp": "embedded\u002F75fd5ae552fbafb6fcd5bc2ecf20e21dd6e44d36ad54c1538266cc14fbd3290e.bmp"
      },
      "parameters": {},
      "responses": {
        "": ""
      },
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
// pre-allocate images
this.options.media.images = Object.entries(this.options.files)
  .filter(([localPath]) => localPath.endsWith('.bmp')) ///\.bmp^|\.png^/
  .map(([localPath, poolPath]) => poolPath);

//indi_left    = this.random.choice([true,false]); // see RL Intro

n_stimuli    = 4;

n_conditions = 1;

n_pairs      = Object.keys(this.files).length / 2;

n_rep        = 10;

pairs = this.random.shuffle(
  Array.from({length: n_pairs}, (entry, i) => ( /** don't forget the normal brackets here! */ {
    index : i + 1, 
    high_A: this.random.choice([true,false])}
  )));

left = Array.from({length: n_stimuli * n_conditions * n_rep}, (entry, i) => ({left_A: this.random.choice([true,false])}))



indi_left = this.random.choice([true,false]);

colYou   = '#D9D9D9';//'#FFFFFF';
//colNo    = '#D55E00';
//colHigh  = '#E670BB'; //'#CC79A7';
//colLow   = '#009E73';

reward    = 10;

p_high    = .70; // probability of reward
}
      },
      "title": "RL Task",
      "content": [
        {
          "type": "lab.flow.Sequence",
          "files": {
            "females_013.jpg": "embedded\u002F87264837e47931d631495849cd9a9254d0edc7341271cc1f32dacbc4c46bf99e.jpg"
          },
          "parameters": {
            "condition": "no status",
            "_name": "J. MILLER",
            "ladder": "https:\u002F\u002Fuozdoe.eu.qualtrics.com\u002FControlPanel\u002FGraphic.php?IM=IM_b41iBj5Qf0Kcx1k",
            "_colOther": "#56B4E9"
          },
          "responses": {
            "": ""
          },
          "messageHandlers": {},
          "title": "No Status",
          "content": [
            {
              "type": "lab.flow.Loop",
              "files": {},
              "parameters": {},
              "templateParameters": [],
              "sample": {
                "mode": "sequential"
              },
              "responses": {
                "": ""
              },
              "messageHandlers": {
                "before:prepare": function anonymous(
) {
let condition = [
  {individual: true},
  {individual: false}];

condition.forEach(
  (type, i) => (condition[i] = Object.assign( 
    type, // equivalent to ...condition[i]
    {left_side: type.individual ? indi_left : !indi_left}, 
    pairs[i + 0 * n_stimuli] 
  ))
)

condition = Array(n_rep).fill(condition);

// pseudo-randomisation
condition = condition.map(group => this.random.shuffle(group)).flat();

// copy without reference
this.options.templateParameters = JSON.parse(JSON.stringify(condition));


this.options.templateParameters.forEach(
  (trial, i) => (this.options.templateParameters[i] = Object.assign( 
      trial, 
      left[i + n_stimuli * 0 * n_rep] 
    ))
  );



this.options.events['keypress(Space)'] = function() {
  this.end('done')
}

this.options.parameters['fullscreen'] = [screen.width, screen.height]
}
              },
              "title": "No Status Task",
              "shuffleGroups": [],
              "template": {
                "type": "lab.flow.Sequence",
                "files": {},
                "parameters": {},
                "responses": {
                  "": ""
                },
                "messageHandlers": {},
                "title": "RL Trial",
                "content": [
                  {
                    "type": "lab.html.Screen",
                    "files": {},
                    "parameters": {},
                    "responses": {
                      "": ""
                    },
                    "messageHandlers": {},
                    "title": "ITI",
                    "content": "\u003Cdiv style=\"border-left: 5px solid white; margin-left: -2.5px; height: 100%; position: absolute; left: 50%; top: 0;\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Cmain class=\"${this.parameters.left_side ? 'content-horizontal-left' : 'content-horizontal-right'} content-vertical-center\" style=\"width:100%; height:100%; padding:0\"\u003E\r\n  \u003Cdiv style=\"width:50%\" id=\"container\"\u003E\r\n    \u003Cp style=\"font-size:3rem; margin-bottom: 7.5%\"\u003E+\u003C\u002Fp\u003E\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E\r\n",
                    "timeout": "1000"
                  },
                  {
                    "type": "lab.html.Screen",
                    "files": {},
                    "parameters": {},
                    "responses": {
                      "": ""
                    },
                    "messageHandlers": {
                      "before:prepare": function anonymous(
) {
this.options.events['keypress(f)']=function(){
  if(this.timer < 5000 & !this.parameters['response']){
    this.options.el.querySelector('#left').style['outline'] = 'solid 5px ' + (this.parameters.individual ? colYou : this.parameters._colOther);

    this.options.parameters['response']     = 'left';
    
    this.options.parameters['responseTime'] = this.timer;

    // define probability of winning depending on choice
    let prob_win = (this.parameters.high_A === this.parameters.left_A) ? p_high : (1 - p_high) // if the two have the same value, the high reward option is on the left
    
    // set the reward
    this.options.parameters['reward'] = (this.random.random()  < prob_win) ? reward : 0

    setTimeout(() => {
      this.options.el.querySelector('#reward').innerHTML = this.parameters.reward
      this.options.el.querySelector('#choice').innerHTML = '&nbsp;'
    }, 1000)
    setTimeout(() => this.end('choice'), 2000)
}}

this.options.events['keypress(j)']=function(){
  if(this.timer < 5000 & !this.parameters['response']){
    this.options.el.querySelector('#right').style['outline'] = 'solid 5px ' + (this.parameters.individual ? colYou : this.parameters._colOther);
    
    this.options.parameters['response']     = 'right';
    
    this.options.parameters['responseTime'] = this.timer;
    
    // define probability of winning depending on choice
    let prob_win = (this.parameters.high_A === this.parameters.left_A) ? (1 - p_high) : p_high // if the two have the same value, the high reward option is on the left
    
    // set the reward
    this.options.parameters['reward'] = (this.random.random()  < prob_win) ? reward : 0

    setTimeout(() => {
      this.options.el.querySelector('#reward').innerHTML = this.parameters.reward
      this.options.el.querySelector('#choice').innerHTML = '<span style="font-size: 3rem">+</span>'
    }, 1000)
    setTimeout(() => this.end('choice'), 2000)
}}


this.options.parameters._optionLeft  = this.parameters.index + (this.parameters.left_A ? 'a' : 'b') + '.bmp';

this.options.parameters._optionRight = this.parameters.index + (this.parameters.left_A ? 'b' : 'a') + '.bmp';
},
                      "run": function anonymous(
) {
setTimeout(() => {
  if (!this.parameters['response']){
    this.options.el.querySelector('#container').innerHTML = '<p style="font-size:2rem;">missing answer</p>';
    //this.options.parameters['reward'] = 0; // set the reward to zero for feedback
    setTimeout(() => this.end('missing'), 1000);
    }
  }, 5000)
},
                      "end": function anonymous(
) {
this.options.parameters.correctResponse = (this.parameters.high_A === this.parameters.left_A ? 'left' : 'right');

this.options.parameters.correct         = (this.parameters.response === this.parameters.correctResponse);
}
                    },
                    "title": "RL Choice",
                    "content": "\u003Cdiv style=\"border-left: 5px solid white; margin-left: -2.5px; height: 100%; position: absolute; left: 50%; top: 0;\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n\u003Cmain class=\"${this.parameters.left_side ? 'content-horizontal-left' : 'content-horizontal-right'} content-vertical-center\"\u003E\r\n  \u003Cdiv style=\"width:50%\" id=\"container\"\u003E\r\n\r\n    \u003Cdiv style=\"margin-bottom: 5%; overflow: visible; height: 0; position: relative;\" class=\"content-horizontal-center\"\u003E\r\n      ${this.parameters.individual | (typeof this.parameters.ladder === 'undefined') \r\n      ? '\u003Cp style=\"position: absolute; bottom: 0; font-size: 2rem; color: ' + (this.parameters.individual ? colYou : this.parameters._colOther) + ';\"\u003E' + (this.parameters.individual ? '나' : this.parameters._name) + '\u003C\u002Fp\u003E' \r\n      : '\u003Cimg id=\"ladder\" style=\"position: absolute; bottom: 0; max-width: 10vw; min-width: 70px; padding-right: 0vw;\" src=\"https:\u002F\u002Fuozdoe.eu.qualtrics.com\u002FControlPanel\u002FGraphic.php?IM=IM_8BW5jfEvVSSWTQi\"\u003E'}\u003C\u002Fdiv\u003E\r\n    \r\n    \u003Cdiv class=\"content-vertical-center content-horizontal-center\"\u003E\r\n      \u003Cimg id=\"left\" src=\"${this.files[this.parameters._optionLeft]}\" style=\"margin: auto 4% auto auto; width:11vw; min-width: 130px; max-width:140px; padding: 10px;\"\u003E\r\n      \u003Cp style=\"font-size:2vw; width: 7vw\" id=\"choice\"\u003E\r\n        선택\u003C\u002Fp\u003E\r\n      \u003Cimg id=\"right\" src=\"${this.files[this.parameters._optionRight]}\" style=\"margin: auto auto auto 4%; width:11vw; min-width: 130px; max-width:140px; padding: 10px;\"\u003E\u003C\u002Fdiv\u003E\r\n\r\n    \u003Cdiv style=\"margin-top: 10%; overflow: visible; height: 0; position: relative;\" class=\"content-horizontal-center\"\u003E\u003Cp style=\"position: relative; top: 0; margin-top: 0; font-size: 3rem; color: ${this.parameters.individual ? colYou : this.parameters._colOther}\" id=\"reward\"\u003E&nbsp;\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\r\n\r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
})

// Let's go!
study.run()