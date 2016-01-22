import Game from './Game'

class Start extends Phaser.Game {

   constructor() {
      super(400, 300, Phaser.AUTO, 'content', null, false, false)
      this.state.add('Game', Game, false)
      this.state.start('Game', Game, false)
   }
}

new Start()
