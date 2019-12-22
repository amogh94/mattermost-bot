module.exports={
  host:"chat.alt-code.org",
  group:"CSC510-F19",
  botName:"guerdon_bot",
  defaultReply:"Hello there!",
  defaultError:"Error!! Please try again after sometime",
  trainingReply: (name) => {return `Thanks @${name}. I will notify you when your classifier is trained. Watch this space!`},
  testingReply: (name) => {return `Thanks @${name}. I will notify you when I can find your classifier and test your message on it. Watch this space!`},
  classifierApiHost:"http://classifier:8000",
  mattermostApiHost: "http://chat.alt-code.org/api/v4",
  apiUrls:{
    testGuerdon: "/testClassifier/Guerdon",
    testClassifier: "/testClassifier",
    mattermostTopN: (channelId)=>{
        return `/channels/${channelId}/posts`;
    },
    mattermostUsers:"/users",
    trainClassifier: "/trainClassifier"
  },
  mattermostNumberOfDays: 60,
  channelId:"djfo9foprfghueegmoyzih1ude",
  formattedMattermostAPIResponse: [
      {id: "user1", score: 30, name: "ABC"},
      {id: "user2", score: 20, name: "XYZ"}
    ],
  greetingMatcher:()=>{
    return new RegExp(/hi\s+guerdon/);
  },
  trainClassifierMatcher:()=>{
    return new RegExp(/train\s+my\s+classifier\s+\;\s+[^\s]+\s*/);
  },
  testGuerdonClassifierMatcher:()=>{
    return new RegExp(/classify\s+my\s+text\s+\;\s+[^\s]+\s*/);
  },
  testYourClassifierMatcher:()=>{
    return new RegExp(/test\s+the\s+classifier\s+\;\s+[^\s]+\s+\;\s+/);
  },
  testMattermostTopUsersMatcher:()=>{
    return new RegExp(/top\s+\d+/);
  },
  greeting:[
      "Hi I am Guerdon. Here is what I can do for you. Mention the input cases in the following format for the respective tasks-",
      "1) Train your text classifier - \"Train my classifier ; <a link to your dataset stored in a csv format; Please keep column names as: \"text\" for data and \"tone\" for class.>\"",
      "2) Provide trained classifier and input data to test the classifier - \"Test the classifier ; <a link to your model as a .pkl file> ;  <your text here>\" ",
      "3) Test our Bot classifier - \"Classify my text ; <input text>\"",
      "4) Mattermost top 5 members using our AI bot- \"Find top 5 members\" (you can replace 5 with any number)"
    ]
};
