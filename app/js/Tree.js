class Tree {
    constructor(pos, width, height) {
        width = width || 1;
        height = height || 2;
        Tree.TrunkMaterial = Tree.TrunkMaterial || new THREE.MeshLambertMaterial({ color: 'brown' });
        Tree.LeafMaterial = Tree.LeafMaterial || new THREE.MeshLambertMaterial({ color: 'green' });
        this.mesh = new THREE.Mesh(new THREE.Geometry(), Tree.TrunkMaterial);
        var t = this.trunk(width / 2, height, 3);
        t.position.copy(pos);
        this.mesh.add(t);
        // for (var i = 0; i < 5; ++i) {
        //     var from = new THREE.Vector3(0, height * i, 0).add(pos);
        //     var to = new THREE.Vector3(0, height * (i+1), 0).add(pos);
        //     var m = Utils.cylinderMesh(from, to, width / (i+2), width / (i+3));
        //     m.material = Tree.TrunkMaterial;
        //     this.mesh.add(m);
        // }
    }

    trunk(width, height, depth) {
        var m = new THREE.Mesh(new THREE.CylinderGeometry(width * 0.8, width, height), Tree.TrunkMaterial);
        m.geometry.translate(0, height * 0.5, 0);
        if (depth > 0) {
            var son = this.trunk(width * 0.8, height, depth - 1);
            son.rotation.x += 20 * Math.PI / 180;
            m.add(son);
            var son = this.trunk(width * 0.8, height, depth - 1);
            son.rotation.x += -20 * Math.PI / 180;
            m.add(son);
            // var ball = new THREE.Mesh(new THREE.SphereGeometry(width), Tree.TrunkMaterial);
            // ball.position.y += height * 1.5;
            // m.add(ball);
        } else {
            var ball = new THREE.Mesh(new THREE.SphereGeometry(width * 4), Tree.LeafMaterial);
            ball.position.y += height;
            m.add(ball);
        }
        m.position.add(new THREE.Vector3(0, height, 0));
        return m;
        // this.mesh.add(m);
    }
}