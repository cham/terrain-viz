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

        var updates = 0;
        var updateEvery = 1;

        var terrain = new AudioTerrain({
            colours: {fill: 0x00cccc, wireframe: 0x44ffff},
            width: 128,
            height: 128
        });

        var audio = new AudioData({
            src: 'mp3/zoladomain-sunglass.mp3',
            width: 128,
            onTick: function(buffer){
                terrain.update(buffer);
                if(updates++ % updateEvery === 0){
                    terrain.smearDown();
                }
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
