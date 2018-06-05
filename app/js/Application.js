class Application {
    init() {
        this.ballSize = 3;

        this.initGui();

        var material = new THREE.MeshStandardMaterial({ color: 'red' });
        // this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), materianew THREE.SphereGeometry(1Mesh32, 32), materia)l);
        // this.mesh.position.set(0, 0, 3);
        // this.sceneManager.scene.add(this.mesh);
        this.buildGrid();

        this.applyGuiChanges();
    }

    applyGuiChanges() {
        // console.log(guiParams.ballSize);
        // this.mesh.scale.set(this.ballSize, this.ballSize, this.ballSize);
    }

    initGui() {
        this.applyGuiChanges = this.applyGuiChanges.bind(this);
        this.gui = new dat.GUI({ autoPlace: true, width: 500 });
        // this.gui.add(this, 'ballSize').name('Ball size').min(0.1).max(16).step(0.01).onChange(this.applyGuiChanges);
    }

    onClick(inter) {
        this.sceneManager.scene.remove(this.dot);
        if (inter[0].object !== this.mesh) return;
        this.dot = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshNormalMaterial());
        this.dot.position.copy(inter[0].point);
        this.sceneManager.scene.add(this.dot);
    }

    mergeGeometry(geom, add) {
        var v = geom.vertices.length;
        for (var i = 0; i < add.vertices.length; ++i) {
            geom.vertices.push(add.vertices[i]);
        }
        for (var i = 0; i < add.faces.length; ++i) {
            var f = add.faces[i];
            geom.faces.push(new THREE.Face3(f.a + v, f.b + v, f.c + v));
        }
    }
    buildGrid() {
        this.land = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshLambertMaterial({ vertexColors: THREE.FaceColors }));
        this.sceneManager.scene.add(this.land);
        this.terrain = new Terrain(this.land);

        for (var y = -7; y <= 7; y += 0.1) {
            for (let x = -7; x <= 7; x += 0.1) {
                this.terrain.buildSquareAt(x, y, 0.1);
                if (Math.random() > 0.99) {
                // if (Math.abs(Math.abs(x) + Math.abs(y)) < 0.0001) {
                    var h = this.terrain.calcHeightAt(x, y, this.terrain.geoLOD);
                    this.sceneManager.scene.add(new Tree(new THREE.Vector3(x, h, y), 0.1, 0.2).mesh);
                }
            }
        }

        // this.tree = new Tree(new THREE.Vector3(1,1,1), 0.1, 0.2);
        // this.sceneManager.scene.add(this.tree.mesh);
        // this.tree.mesh.geometry.applyMatrix(this.tree.mesh.matrix);
        // this.mergeGeometry(this.land.geometry, this.tree.mesh.geometry);

        this.land.geometry.mergeVertices();
        this.land.geometry.computeVertexNormals();
    }
}
