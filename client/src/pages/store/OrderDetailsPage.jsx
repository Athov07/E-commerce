import { useParams, useNavigate } from "react-router-dom";
import OrderTracking from "../../components/order/OrderTracking";
import { useEffect, useState } from "react";
import orderService from "../../services/order.service";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await orderService.getOrderSummary(id);
      setData(res.data);
    };
    fetchDetails();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return <OrderTracking data={data} onBack={() => navigate("/orders")} />;
};

export default OrderDetailsPage;