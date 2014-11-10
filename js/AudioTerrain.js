define([
    'three'
],
function(
    THREE
){
    'use strict';

    function makePlane(colours, width, height){
        var geometry = new THREE.PlaneGeometry(1000, 1000, Math.ceil(width / 2), Math.ceil(height / 2));
        var material  = new THREE.MeshPhongMaterial({
            color: colours.fill,
            ambient: 0x000000
        });
        var wireframeMaterial  = new THREE.MeshPhongMaterial({
            color: colours.wireframe,
            wireframe: true
        });
        var mesh = new THREE.SceneUtils.createMultiMaterialObject(geometry, [
            material,
            wireframeMaterial
        ]);

        mesh.rotation.x = -Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    function getVertexAndNeighbours(vertices, index){
        var vArr = [];

        if(vertices[index-1]){
            vArr.push(vertices[index-1]);
        }
        if(vertices[index]){
            vArr.push(vertices[index]);
        }
        if(vertices[index+1]){
            vArr.push(vertices[index+1]);
        }

        return vArr;
    }

    function increaseVertexGroup(meshVertices, centerIndex, increase){
        var filteredVertices = [];

        filteredVertices = filteredVertices.concat(getVertexAndNeighbours(meshVertices, centerIndex));
        filteredVertices = filteredVertices.concat(getVertexAndNeighbours(meshVertices, centerIndex + meshSideLength));
        filteredVertices = filteredVertices.concat(getVertexAndNeighbours(meshVertices, centerIndex - meshSideLength));

        filteredVertices.forEach(function(vertex){
            vertex.z += increase;
        });
    }

    function randomiseVertices(mesh, accelMap){
        var friction = 0.95;
        
        mesh.geometry.vertices = mesh.geometry.vertices.map(function(vertex, i){
            accelMap[i] += (Math.random() * 0.1) - 0.05;
            accelMap[i] *= friction;

            increaseVertexGroup(mesh.geometry.vertices, i, accelMap[i]);

            if(vertex.z > 300){
                vertex.z = 300;
            }
            return vertex;
        });
        mesh.geometry.verticesNeedUpdate = true;
    }

    function setFaceVelocity(vertices, face, velocity){
        vertices[face.a].z = velocity;
        vertices[face.b].z = velocity;
        vertices[face.c].z = velocity;
    }

    function requiredOptions(opt){
        if(!opt.colours){
            throw new Error('colours {fill,wireframe} is required');
        }
        if(!opt.width){
            throw new Error('width is required');
        }
        if(!opt.height){
            throw new Error('height is required');
        }
    }

    function Terrain(options){
        requiredOptions(options || {});

        this.width = options.width;
        this.plane = makePlane(options.colours, options.width, options.height);
    }

    Terrain.prototype.getObject = function getObject(){
        return this.plane;
    };

    Terrain.prototype.update = function(vertexData){
        var numDataPoints = vertexData.length;
        var geometry = this.plane.children[0].geometry;
        var vertices = geometry.vertices;
        var faces = geometry.faces;

        for(var i = 0; i < numDataPoints; i++){
            setFaceVelocity(vertices, faces[i], vertexData[i]);
        }

        geometry.verticesNeedUpdate = true;
    };

    Terrain.prototype.smearDown = function(){
        var geometry = this.plane.children[0].geometry;
        var vertices = geometry.vertices;
        var faces = geometry.faces.slice();

        for(var i = faces.length - 1; i >= this.width; i--){
            var sampleZ = vertices[faces[i - this.width].b].z;
            setFaceVelocity(vertices, faces[i], sampleZ);
        }

        geometry.verticesNeedUpdate = true;
    };

    return Terrain;

});
