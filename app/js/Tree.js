class Tree {
    constructor(pos, width, height) {
        width = width || 1;
        height = height || 2;
        Tree.TrunkMaterial = Tree.TrunkMaterial || new THREE.MeshLambertMaterial({ color: 'brown' });
        this.mesh = new THREE.Mesh(new THREE.CylinderGeometry(width / 2, width / 2, height), Tree.TrunkMaterial);
        this.mesh.position.set(pos.x, pos.y + height / 2.0, pos.z);
        this.mesh.rotation.set(Math.PI / 2, 0, 0);
    }
}