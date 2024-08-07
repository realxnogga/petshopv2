

<?php

require_once "../connection/connection.php";

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
        case 'putProduct':

            $data = json_decode($_POST['credential'], true);

            $productname = $data['productname'];
            $productsize = $data['productsize'];
            $productstock = $data['productstock'];
            $productprice = $data['productprice'];
            $productdescription = $data['productdescription'];
            $productcategory = $data['productcategory'];


            $file = $_FILES['imagecredential'];

            $productImageName = $file['name'];
            $uniqueProductImageName =  $productImageName . "_" . $timestamp = date("YmdHis");
            $productImageTMP = $file['tmp_name'];
            $productImageDestination = '../../public/asset/admin/productimage/' . $uniqueProductImageName;

            move_uploaded_file($productImageTMP, $productImageDestination);

            $sql = "INSERT INTO adminproduct (productname, productsize, productstock, productprice, productdescription, productcategory, productimage) VALUES ('$productname', '$productsize', '$productstock', '$productprice', '$productdescription', '$productcategory', '$uniqueProductImageName')";

            $conn->query($sql);

            if ($conn->affected_rows > 0) {
                echo json_encode(true);
            } else {
                echo json_encode(false);
            }

            $conn->close();
            break;

        case 'getProduct':

            $sql = "select*from adminproduct";
            $result = $conn->query($sql);

            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            echo json_encode($data);

            $conn->close();
            break;

        case 'deleteProduct':

            $data = json_decode($_POST['credential'], true);

            $productID = $data['productID'];
            $productimage = $data['productimage'];

            $sql = "delete from adminproduct where productID = '$productID'";
            $conn->query($sql);

            if ($conn->affected_rows > 0) {

                // delete the add to cart data also
                $sql = "delete from addtocartproduct where addtocartproductID = '$productID'";
                $conn->query($sql);

                $productImagePath = "../../public/asset/admin/productimage/" . $productimage;
                if (file_exists($productImagePath)) {
                    unlink($productImagePath);
                }

                echo json_encode(true);
            } else {
                echo json_encode(false);
            }

            $conn->close();
            break;

        case 'updateProductStock':

            // Get the JSON data from the request
            $data = json_decode($_POST['credential'], true);

            // Extract the product ID and total stock from the JSON data
            $productID = $data['productID'];
            $producttotalstock = $data['producttotalstock'];

            // Update the product stock using normal SQL query
            $sql = "UPDATE adminproduct SET productstock = '$producttotalstock' WHERE productID = '$productID'";
            $conn->query($sql);

            // Check if any rows were affected by the update
            if ($conn->affected_rows > 0) {
                echo json_encode(true);

                // Select the updated product stock
                $sql = "SELECT productstock FROM adminproduct WHERE productID = '$productID'";
                $result = $conn->query($sql);

                // Check if we have a result and fetch the product stock
                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    if ($row['productstock'] == 0) {
                        // Delete the product if stock is zero
                        $sql = "DELETE FROM adminproduct WHERE productID = '$productID'";
                        $conn->query($sql);
                    }
                }
            } else {
                echo json_encode(false);
            }

            // Close the database connection
            $conn->close();
            break;



        case 'updateProduct':

            $data = json_decode($_POST['credential'], true);

            $productID = $data['productID'];
            $productname = $data['productname'];
            $productsize = $data['productsize'];
            $productstock = $data['productstock'];
            $productprice = $data['productprice'];
            $productdescription = $data['productdescription'];
            $productcategory = $data['productcategory'];
            $productimagetobereplace = $data['productimage'];

            $file = $_FILES['imagecredential'];

            $productPicName = $file['name'];
            $uniqueProductPicName = $productPicName . "_" . date("YmdHis");
            $productPicTMP = $file['tmp_name'];
            $productPicDestination = '../../public/asset/admin/productimage/' . $uniqueProductPicName;

            $sql = "UPDATE `adminproduct` SET `productname` = '$productname', `productsize` = '$productsize', `productstock` = '$productstock', `productprice` = '$productprice', `productdescription` = '$productdescription', `productcategory` = '$productcategory', `productimage` = '$uniqueProductPicName' WHERE `productID` = '$productID'";

            $result = $conn->query($sql);

            if ($result === TRUE) {
                echo json_encode(true);
                
                // update product image name in addtocart table also
                $sql = "UPDATE addtocartproduct SET addtocartproductimage = '$uniqueProductPicName' WHERE addtocartproductID = '$productID'";
                $conn->query($sql);
                // -----------------------------------------------------

                if ($file && $file['error'] == 0 && is_uploaded_file($productPicTMP)) {
                    $productPicToBeReplacePath = "../../public/asset/admin/productimage/" . $productimagetobereplace;

                    if (file_exists($productPicToBeReplacePath)) {
                        unlink($productPicToBeReplacePath);
                    }

                    move_uploaded_file($productPicTMP, $productPicDestination);
                }
            } else {
                echo json_encode(false);
            }

            $conn->close();
            break;
    }
}


?>