import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  birthDate: string;
  gender: string;
  avatar: string;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  orderDate: string;
  status: string;
  total: number;
  items: OrderItem[];
  deliveryAddress?: string;
  trackingSteps?: TrackingStep[];
}

interface TrackingStep {
  date: string;
  time: string;
  status: string;
  description: string;
  completed: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule,ReactiveFormsModule],
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit {
  activeTab: string = 'profile';
  userForm: FormGroup;
  addressForm: FormGroup;
  showAddressModal: boolean = false;
  showTrackingModal: boolean = false;
  editingAddressId: string | null = null;
  selectedOrder: Order | null = null;

  user: User = {
    id: '1',
    username: 'nguyenvana',
    email: 'nguyenvana@gmail.com',
    fullName: 'Nguyễn Văn A',
    phone: '0123456789',
    birthDate: '1990-01-01',
    gender: 'male',
    avatar: 'https://via.placeholder.com/80x80'
  };

  addresses: Address[] = [
    {
      id: '1',
      fullName: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '123 Đường ABC, Phường XYZ',
      ward: 'Phường XYZ',
      district: 'Quận 1',
      city: 'TP. Hồ Chí Minh',
      isDefault: true
    },
    {
      id: '2',
      fullName: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '456 Đường DEF, Phường UVW',
      ward: 'Phường UVW',
      district: 'Quận 2',
      city: 'TP. Hồ Chí Minh',
      isDefault: false
    }
  ];

  orders: Order[] = [
    {
      id: 'DH001',
      orderDate: '2024-12-20',
      status: 'Đang giao',
      total: 350000,
      deliveryAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh',
      items: [
        {
          id: '1',
          name: 'Áo thun nam cotton',
          image: 'https://via.placeholder.com/60x60',
          quantity: 2,
          price: 150000
        },
        {
          id: '2',
          name: 'Quần jeans slim fit',
          image: 'https://via.placeholder.com/60x60',
          quantity: 1,
          price: 200000
        }
      ],
      trackingSteps: [
        {
          date: '20/12/2024',
          time: '14:30',
          status: 'Đã đặt hàng',
          description: 'Đơn hàng đã được đặt thành công',
          completed: true
        },
        {
          date: '20/12/2024',
          time: '16:45',
          status: 'Đã xác nhận',
          description: 'Người bán đã xác nhận đơn hàng',
          completed: true
        },
        {
          date: '21/12/2024',
          time: '09:15',
          status: 'Đang chuẩn bị',
          description: 'Đang chuẩn bị hàng hóa',
          completed: true
        },
        {
          date: '21/12/2024',
          time: '15:20',
          status: 'Đang vận chuyển',
          description: 'Hàng đã được giao cho đơn vị vận chuyển',
          completed: true
        },
        {
          date: '22/12/2024',
          time: '10:00',
          status: 'Đang giao hàng',
          description: 'Shipper đang trên đường giao hàng',
          completed: false
        },
        {
          date: '',
          time: '',
          status: 'Đã giao hàng',
          description: 'Giao hàng thành công',
          completed: false
        }
      ]
    },
    {
      id: 'DH002',
      orderDate: '2024-12-15',
      status: 'Đã giao',
      total: 450000,
      deliveryAddress: '456 Đường DEF, Phường UVW, Quận 2, TP. Hồ Chí Minh',
      items: [
        {
          id: '3',
          name: 'Giày sneaker trắng',
          image: 'https://via.placeholder.com/60x60',
          quantity: 1,
          price: 450000
        }
      ],
      trackingSteps: [
        {
          date: '15/12/2024',
          time: '10:30',
          status: 'Đã đặt hàng',
          description: 'Đơn hàng đã được đặt thành công',
          completed: true
        },
        {
          date: '15/12/2024',
          time: '14:15',
          status: 'Đã xác nhận',
          description: 'Người bán đã xác nhận đơn hàng',
          completed: true
        },
        {
          date: '16/12/2024',
          time: '08:30',
          status: 'Đang chuẩn bị',
          description: 'Đang chuẩn bị hàng hóa',
          completed: true
        },
        {
          date: '16/12/2024',
          time: '16:45',
          status: 'Đang vận chuyển',
          description: 'Hàng đã được giao cho đơn vị vận chuyển',
          completed: true
        },
        {
          date: '17/12/2024',
          time: '14:20',
          status: 'Đang giao hàng',
          description: 'Shipper đang trên đường giao hàng',
          completed: true
        },
        {
          date: '17/12/2024',
          time: '16:30',
          status: 'Đã giao hàng',
          description: 'Giao hàng thành công',
          completed: true
        }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      fullName: [this.user.fullName, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required]],
      birthDate: [this.user.birthDate],
      gender: [this.user.gender]
    });

    this.addressForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      ward: ['', [Validators.required]],
      district: ['', [Validators.required]],
      city: ['', [Validators.required]],
      isDefault: [false]
    });
  }

  ngOnInit(): void {}

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      this.user = { ...this.user, ...formData };
      alert('Cập nhật thông tin thành công!');
    }
  }

  openAddressModal(address?: Address): void {
    this.showAddressModal = true;
    if (address) {
      this.editingAddressId = address.id;
      this.addressForm.patchValue(address);
    } else {
      this.editingAddressId = null;
      this.addressForm.reset();
    }
  }

  closeAddressModal(): void {
    this.showAddressModal = false;
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;

      if (this.editingAddressId) {
        // Update existing address
        const index = this.addresses.findIndex(addr => addr.id === this.editingAddressId);
        if (index !== -1) {
          this.addresses[index] = { ...this.addresses[index], ...formData };
        }
      } else {
        // Add new address
        const newAddress: Address = {
          id: Date.now().toString(),
          ...formData
        };
        this.addresses.push(newAddress);
      }

      // If set as default, unset other defaults
      if (formData.isDefault) {
        this.addresses.forEach(addr => {
          if (addr.id !== this.editingAddressId) {
            addr.isDefault = false;
          }
        });
      }

      this.closeAddressModal();
      alert('Lưu địa chỉ thành công!');
    }
  }

  deleteAddress(addressId: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      this.addresses = this.addresses.filter(addr => addr.id !== addressId);
      alert('Xóa địa chỉ thành công!');
    }
  }

  setDefaultAddress(addressId: string): void {
    this.addresses.forEach(addr => {
      addr.isDefault = addr.id === addressId;
    });
    alert('Đặt làm địa chỉ mặc định thành công!');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đang giao':
        return 'status-shipping';
      case 'Đã giao':
        return 'status-delivered';
      case 'Đã hủy':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  trackOrder(order: Order): void {
    this.selectedOrder = order;
    this.showTrackingModal = true;
  }

  closeTrackingModal(): void {
    this.showTrackingModal = false;
    this.selectedOrder = null;
  }

  reorderItems(order: Order): void {
    // Implement reorder logic here
    alert(`Đã thêm ${order.items.length} sản phẩm vào giỏ hàng!`);
  }

  logout(): void {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Implement logout logic here
      alert('Đăng xuất thành công!');
      // Redirect to login page
    }
  }
}
