class Tree {
    constructor(pos, size) {
        Tree.TrunkMaterial = Tree.TrunkMaterial || new THREE.MeshLambertMaterial({ color: 'brown' });
        Tree.LeafMaterial = Tree.LeafMaterial || new THREE.MeshLambertMaterial({ color: 'green' });
        this.mesh = new THREE.Mesh(new THREE.Geometry(), Tree.TrunkMaterial);
        var t = this.trunk(size, 4);
        t.position.copy(pos);
        this.mesh.add(t);
    }

    trunk(size, depth) {
        function rand(from, to) {
            return Math.random() * (to - from) + from;
        }
        function rotate(m, x, y, z) {
            m.rotation.x += x * Math.PI / 180;
            m.rotation.y += y * Math.PI / 180;
            m.rotation.z += z * Math.PI / 180;
            return m;
        }
    
        var m = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.2, size * 0.25, size, 6, 1), Tree.TrunkMaterial);
        m.geometry.translate(0, size * 0.5, 0);
        if (depth > 0) {
            var branches = Math.floor(rand(1, 5));
            for (var b = 0; b < branches; ++b) {
                m.add(rotate(this.trunk(size * 0.8, depth - 1), rand(-20, 20), rand(-20, 20) + 360 / branches * b, rand(-20, 20) + 30));
            }
        } else {
            var ball = new THREE.Mesh(new THREE.SphereGeometry(size * 0.5), Tree.LeafMaterial);
            ball.position.y += size;
            m.add(ball);
        }
        m.position.add(new THREE.Vector3(0, size, 0));
        return m;
    }
}