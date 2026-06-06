import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  Trash2, 
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getProducts } from '@/api/EcommerceApi';
import { parseHorseFields } from '@/utils/horseUtils';

const HorseImportStatusTable = () => {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        
        const processedData = (data.products || []).map(product => {
          const variant = product.variants?.[0];
          const qty = variant?.inventory_quantity || 0;
          const fields = parseHorseFields(product);
          
          let import_status = 'Pending';
          if (product.purchasable && qty > 0) import_status = 'Active';
          else if (!product.purchasable || qty <= 0) import_status = 'Sold/Archived';

          return {
            id: product.id,
            name: product.title,
            breed: fields.category || 'Friesian',
            price: variant?.price_in_cents || 0,
            priceFormatted: variant?.price_formatted || 'N/A',
            import_status,
            created_at: product.created_at || new Date().toISOString(),
            image: product.image
          };
        });
        
        setHorses(processedData);
      } catch (err) {
        toast({ title: "Error fetching products", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchHorses();
  }, [toast]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedHorses = useMemo(() => {
    let result = horses.filter(horse => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (horse.name || '').toLowerCase().includes(searchLower) || 
        (horse.breed || '').toLowerCase().includes(searchLower);
        
      const matchesStatus = statusFilter === 'All' || horse.import_status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [horses, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedHorses.length / itemsPerPage) || 1;
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const paginatedHorses = filteredAndSortedHorses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status === 'Pending') return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  const handleAction = (action) => {
    toast({ description: `🚧 ${action} action isn't implemented yet. 🚀` });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <ArrowUpDown size={14} className="text-muted-foreground/50 opacity-0 group-hover:opacity-100" />;
    return <ArrowUpDown size={14} className="text-primary" />;
  };

  return (
    <div className="bg-card rounded-2xl border border-border/20 shadow-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-border/20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-background/50">
        <div>
          <h3 className="text-xl font-bold text-foreground font-['Playfair_Display']">Product Inventory</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your online store listings.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or breed..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-input border border-border/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/70"
            />
          </div>
          
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 bg-input border border-border/30 rounded-xl pl-10 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Sold/Archived">Sold/Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6 cursor-pointer hover:bg-secondary/50 transition-colors group select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">Horse Info <SortIcon column="name" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors group select-none" onClick={() => handleSort('breed')}>
                <div className="flex items-center gap-2">Category <SortIcon column="breed" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors group select-none" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-2">Price <SortIcon column="price" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors group select-none" onClick={() => handleSort('import_status')}>
                <div className="flex items-center gap-2">Status <SortIcon column="import_status" /></div>
              </th>
              <th className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors group select-none" onClick={() => handleSort('created_at')}>
                <div className="flex items-center gap-2">Import Date <SortIcon column="created_at" /></div>
              </th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground text-sm">Syncing with Online Store...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedHorses.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center">
                  <div className="bg-secondary/20 inline-block p-4 rounded-full mb-3">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium">No products found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters.</p>
                </td>
              </tr>
            ) : (
              paginatedHorses.map((horse) => (
                <tr key={horse.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden border border-border/20 flex-shrink-0">
                        {horse.image ? (
                          <img src={horse.image} alt={horse.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 text-xs">No Img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-base font-['Playfair_Display']">{horse.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {horse.id.substring(0,8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-foreground bg-secondary/50 px-2.5 py-1 rounded-md border border-border/30">
                      {horse.breed}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-foreground">
                    {horse.priceFormatted}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${getStatusColor(horse.import_status)}`}>
                      {horse.import_status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-medium">
                    {new Date(horse.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleAction('View')} className="p-2 bg-secondary/80 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-all border border-transparent hover:border-primary/20 shadow-sm" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleAction('Edit')} className="p-2 bg-secondary/80 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-secondary transition-all border border-transparent hover:border-blue-400/20 shadow-sm" title="Edit Listing">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleAction('Delete')} className="p-2 bg-secondary/80 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-secondary transition-all border border-transparent hover:border-red-400/20 shadow-sm" title="Delete Listing">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filteredAndSortedHorses.length > 0 && (
        <div className="p-4 border-t border-border/20 flex items-center justify-between bg-background/50 mt-auto">
          <span className="text-sm text-muted-foreground font-medium">
            Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredAndSortedHorses.length)}</span> of <span className="text-foreground">{filteredAndSortedHorses.length}</span> entries
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg bg-secondary border border-border/30 text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary/80 hover:border-primary/50 transition-all shadow-sm flex items-center"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center px-3 text-sm font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg bg-secondary border border-border/30 text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary/80 hover:border-primary/50 transition-all shadow-sm flex items-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HorseImportStatusTable;