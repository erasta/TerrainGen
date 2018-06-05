class Utils {
    static cylinder(from, to, radiusFrom, radiusTo, openEnded) {
        var height = to.distanceTo(from);
        var mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTo, radiusFrom, height, 8, 1, openEnded));
        mesh.position.addVectors(from, to.clone().sub(from).divideScalar(2.0));
        var q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), to.sub(from).normalize());
        mesh.rotation.setFromQuaternion(q);
        mesh.geometry.applyMatrix(mesh.matrixWorld);
        return mesh.geometry;
    }

    static cylinderMesh(pointX, pointY, radiusFrom, radiusTo, openEnded) {
        /* edge from X to Y */
        var direction = new THREE.Vector3().subVectors(pointY, pointX);
        var orientation = new THREE.Matrix4();
        /* THREE.Object3D().up (=Y) default orientation for all objects */
        orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
        /* rotation around axis X by -90 degrees 
         * matches the default orientation Y 
         * with the orientation of looking Z */
        var mat = new THREE.Matrix4();
        mat.set(1, 0, 0, 0,
            0, 0, 1, 0,
            0, -1, 0, 0,
            0, 0, 0, 1);
        orientation.multiply(mat);

        /* cylinder: radiusAtTop, radiusAtBottom, 
            height, radiusSegments, heightSegments */
        var edgeGeometry = new THREE.CylinderGeometry(radiusTo, radiusFrom, direction.length(), 8, 1, openEnded);
        var edge = new THREE.Mesh(edgeGeometry,
            new THREE.MeshBasicMaterial({ color: 0x0000ff }));

        edge.applyMatrix(orientation)
        edge.position.addVectors(pointX, direction.multiplyScalar(0.5));
        return edge;
    }
}