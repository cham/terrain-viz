require(['requireConfig'], function(){
    'use strict';

    require([
        'js/AudioData',
        'js/TerrainScene',
        'js/AudioTerrain'
    ], function(
        AudioData,
        TerrainScene,
        AudioTerrain
    ){

        var tickCount = 0;
        var updateEvery = 3;

        var terrain = new AudioTerrain({
            colours: {fill: 0xcc0000, wireframe: 0xff3333},
            width: 128,
            height: 128
        });

        var audio = new AudioData({
            src: 'mp3/minuit-jacuzzi.mp3',
            width: 128,
            onTick: function(buffer){
                terrain.update(buffer);
                // if(tickCount++ % updateEvery === 0){
                    terrain.smearDown();
                // }
            }
        });

        var terrainScene = new TerrainScene();

        terrainScene.appendTo(document.body);
        terrainScene.addTerrain(terrain.getObject());

        window.onresize = function(){
            terrainScene.resize();
        };

        function tick(){
            requestAnimationFrame(tick);
            terrainScene.render();
        }
        tick();

    });

});
