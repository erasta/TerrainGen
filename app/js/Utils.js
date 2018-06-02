class Utils {
    static cylinder(from, to, radiusFrom, radiusTo, openEnded) {
        var height = to.distanceTo(from);
        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTo, radiusFrom, height, 8, 1, openEnded));
        mesh.position.addVectors(from, to.clone().sub(from).divideScalar(2.0));
        var q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), to.sub(from).normalize());
        mesh.rotation.setFromQuaternion(q);
        // set((from.x + to.x) / 2.0, (from.y + to.y) / 2.0 + height / 2.0, (from.z + to.z) / 2.0);
        // mesh.rotation.set(Math.PI / 2, 0, 0);
        return mesh;
    }
}