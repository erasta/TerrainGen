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

    terrain(coordx, coordy, octaves) {
        function fractsin(a) {
            a = 100000.0 * Math.sin(a * .001);
            return a - Math.floor(a);
        }
        function mix(x, y, a) {
            return x * (1 - a) + y * a;
        }
        function smoothstep(edge0, edge1, x) {
            var t = (x - edge0) / (edge1 - edge0);
            t = Math.min(1, Math.max(0, t));
            return t * t * (3.0 - 2.0 * t);
        }
        function snoise(coordx, coordy) {
            var px = Math.floor(coordx), py = Math.floor(coordy);
            var fx = coordx - px, fy = coordy - py;
            var v = px + py * 1000.0;
            var rx = fractsin(v), ry = fractsin(v + 1), rz = fractsin(v + 1000), rw = fractsin(v + 1001);
            fx = fx * fx * (3.0 - 2.0 * fx);
            fy = fy * fy * (3.0 - 2.0 * fy);
            return 2.0 * (mix(mix(rx, ry, fx), mix(rz, rw, fx), fy)) - 1.0;
        }
        var h = 0.0; // height
        var w = 0.5; // octave weight
        var m = 0.4; // octave multiplier
        for (var i = 0; i < 20; i++) {
            if (i < octaves) {
                h += w * snoise(coordx * m, coordy * m);
            }
            else break;
            w *= 0.5;
            m *= 2.0;
        }
        h += smoothstep(-0.6, 1.2, h); // exaggerate the higher terrain
        return h;
    }

    buildGrid() {
        this.land = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshLambertMaterial({ color: 'green' }));
        this.sceneManager.scene.add(this.land);

        var colors = [new THREE.Color('pearl'), new THREE.Color('green'), new THREE.Color('brown')]
        const geoLOD = 4;
        for (var y = -50; y <= 50; y += 0.2) {
            for (let x = -50; x <= 50; x += 0.2) {
                var x0 = x / 10, y0 = y / 10, x1 = x0 + 0.02, y1 = y0 + 0.02;
                var v = this.land.geometry.vertices.length;
                var h00 = this.terrain(x0 + 10, y0 + 10, geoLOD);
                var h01 = this.terrain(x0 + 10, y1 + 10, geoLOD);
                var h10 = this.terrain(x1 + 10, y0 + 10, geoLOD);
                var h11 = this.terrain(x1 + 10, y1 + 10, geoLOD);
                this.land.geometry.vertices.push(new THREE.Vector3(x0 * 10, y0 * 10, h00 * 10));
                this.land.geometry.vertices.push(new THREE.Vector3(x0 * 10, y1 * 10, h01 * 10));
                this.land.geometry.vertices.push(new THREE.Vector3(x1 * 10, y0 * 10, h10 * 10));
                this.land.geometry.vertices.push(new THREE.Vector3(x1 * 10, y1 * 10, h11 * 10));
                this.land.geometry.faces.push(new THREE.Face3(v, v + 2, v + 1, undefined, h00 < -1 ? colors[1] : colors[2]));
                this.land.geometry.faces.push(new THREE.Face3(v + 2, v + 3, v + 1, undefined, h00 > -1 ? colors[1] : colors[2]));
            }
        }

        this.land.geometry.mergeVertices();
        this.land.geometry.computeVertexNormals();
    }
}
