
/*
http://cmusphinx.sourceforge.net/wiki/
*/

export default class Transcriber {
  constructor(){
    /*
    const useJava = (
      typeof window.node !== 'undefined'
          && window.node.java !== 'undefined'
          && window.node.java.import !== 'undefined');
    if (!useJava) return;

    this.java = window.node.java;

    const File                   = this.java.import("java.io.File");
    const FileInputStream        = this.java.import("java.io.FileInputStream");
    const InputStream            = this.java.import("java.io.InputStream");

    const Configuration          = this.java.import("edu.cmu.sphinx.api.Configuration");
    const SpeechResult           = this.java.import("edu.cmu.sphinx.api.SpeechResult");
    const StreamSpeechRecognizer = this.java.import("edu.cmu.sphinx.api.StreamSpeechRecognizer");


    this.conf = this.java.newInstanceSync("edu.cmu.sphinx.api.Configuration");
    //this.conf = new Configuration();

    this.conf.setAcousticModelPath(
      "resource:/edu/cmu/sphinx/models/en-us/en-us"
    )
    this.conf.setDictionaryPath(
      "resource:/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict"
    )
    this.conf.setLanguageModelPath(
      "resource:/edu/cmu/sphinx/models/en-us/en-us.lm.bin"
    )

    this.recognizer = this.java.newInstanceSync("edu.cmu.sphinx.api.StreamSpeechRecognizer", this.conf);
    //this.recognizer = new StreamSpeechRecognizer(this.conf)
    */
  }

  run(){
    return;
    /*
    if (!this.java) return;

    const file = this.java.newInstanceSync("java.io.File", "test.wav");
    const stream = this.java.newInstanceSync("java.io.FileInputStream", file);

    // const stream = new FileInputStream(new File("test.wav")))

    this.recognizer.startRecognition(stream)

    let result;
    while ((result = recognizer.getResult()) != null) {
      console.log("Hypothesis:", result.getHypothesis())
    }
    this.recognizer.stopRecognition()
    */
  }
}


window.debugTranscriber = new Transcriber();
