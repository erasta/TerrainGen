class Tree {
    constructor(pos, width, height) {
        width = width || 1;
        height = height || 2;
        Tree.TrunkMaterial = Tree.TrunkMaterial || new THREE.MeshLambertMaterial({ color: 'brown' });
        this.mesh = new THREE.Mesh(new THREE.Geometry(), Tree.TrunkMaterial);
        for (var i = 0; i < 5; ++i) {
            var from = pos.clone();
            from.y += height * i;
            var to = pos.clone();
            to.y = from.y + height;
            var m = Utils.cylinderMesh(from, to, width / (i+2), width / (i+3));
            m.material = Tree.TrunkMaterial;
            this.mesh.add(m);
        }
    }
}