import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  MenuCategory,
  OrderStatus,
  ReservationStatus,
} from "../backend.d";
import { useActor } from "./useActor";

export function useAllMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMenuItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllReservations() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReservations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useInitializeAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (secret: string) => {
      if (!actor) throw new Error("Not connected");
      return actor._initializeAccessControlWithSecret(secret);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin"] }),
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: MenuCategory;
      price: number;
      isVeg: boolean;
      description: string;
      imageUrl?: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMenuItem(
        data.name,
        data.category,
        BigInt(data.price),
        data.isVeg,
        data.description,
        data.imageUrl ?? null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: MenuCategory;
      price: number;
      isVeg: boolean;
      description: string;
      imageUrl?: string;
      isAvailable: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateMenuItem(
        data.id,
        data.name,
        data.category,
        BigInt(data.price),
        data.isVeg,
        data.description,
        data.imageUrl ?? null,
        data.isAvailable,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menuItems"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateReservationStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: ReservationStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReservationStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reservations"] }),
  });
}

export function useCreateReservation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      date: string;
      time: string;
      guests: number;
      specialRequest?: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createReservation(
        data.name,
        data.phone,
        data.email,
        data.date,
        data.time,
        BigInt(data.guests),
        data.specialRequest ?? null,
      );
    },
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      phone: string;
      address: string;
      items: Array<{ id: number; name: string; price: number; qty: number }>;
      totalAmount: number;
      specialInstructions?: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const orderItems = data.items.map((i) => ({
        qty: BigInt(i.qty),
        itemId: BigInt(i.id),
        name: i.name,
        price: BigInt(i.price),
      }));
      return actor.createOrder(
        data.customerName,
        data.phone,
        data.address,
        orderItems,
        BigInt(data.totalAmount),
        data.specialInstructions ?? null,
      );
    },
  });
}
