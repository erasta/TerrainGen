class Tree {
    constructor(pos, size) {
        Tree.TrunkMaterial = Tree.TrunkMaterial || new THREE.MeshLambertMaterial({ color: 'brown' });
        Tree.LeafMaterial = Tree.LeafMaterial || new THREE.MeshLambertMaterial({ color: 'green' });
        this.mesh = new THREE.Mesh(new THREE.Geometry(), Tree.TrunkMaterial);
        var t = this.trunk(size, 3);
        t.position.copy(pos);
        this.mesh.add(t);
    }

    trunk(size, depth) {
        var m = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.20, size * 0.25, size), Tree.TrunkMaterial);
        m.geometry.translate(0, size * 0.5, 0);
        if (depth > 0) {
            var son = this.trunk(size * 0.8, depth - 1);
            son.rotation.x += 20 * Math.PI / 180;
            m.add(son);
            var son = this.trunk(size * 0.8, depth - 1);
            son.rotation.x += -20 * Math.PI / 180;
            m.add(son);
        } else {
            var ball = new THREE.Mesh(new THREE.SphereGeometry(size * 0.5), Tree.LeafMaterial);
            ball.position.y += size;
            m.add(ball);
        }
        m.position.add(new THREE.Vector3(0, size, 0));
        return m;
        // this.mesh.add(m);
    }
}