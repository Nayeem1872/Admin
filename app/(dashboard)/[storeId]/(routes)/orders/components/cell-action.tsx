"use client"

import { Button } from "@/components/ui/button";

import { DropdownMenuTrigger,DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem  } from "@/components/ui/dropdown-menu";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-model";
import { OrderColumn } from "./columns";


interface CellActionProps {
    data:OrderColumn;
}



export const CellAction:React.FC<CellActionProps> = ({
    data
})=>{

    const router = useRouter()
    const params = useParams()
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const onCopy = (id:string)=>{
        navigator.clipboard.writeText(id)
        toast.success("Billboard Id Copied!")
    }

    const onDelete = async () => {
        try {
          setLoading(true);
          await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
          router.refresh();
          
          toast.success("Billboard Deleted!");
        } catch (error) {
          toast.error("Make sure you delete all the  categories first");
        } finally {
          setLoading(false);
          setOpen(false);
        }
      };
    return(
        <>
        <AlertModal 
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onDelete}
            loading={loading}


        />


        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" variant="ghost">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Action
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Id
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/billboards/${data.id}`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>setOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}