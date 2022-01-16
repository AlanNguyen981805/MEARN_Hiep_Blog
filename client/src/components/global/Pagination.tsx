import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Iprops {
    total: number
}

const Pagination: React.FC<Iprops> = ({ total }) => {
    const [page, setPage] = useState(1)
    const newArr = [...Array(total)].map((_, i) => i + 1)
    const navigate = useNavigate()
    
    const isActive = (index: number) => {
        if(index === page) return "active"
        return ""
    }

    const handlePagination = (num: number) => {
        navigate(`?page=${num}`)
    }

    return (
        <div>
            total page: {total}

            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    
                    {
                        page > 1 && 
                            <li className="page-item" onClick={() => handlePagination(page - 1)}>
                                <a className="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </a>
                            </li>
                    }
                    {
                        newArr.map(num => (
                            <li 
                                className={`page-item ${isActive(num)}`}
                                onClick={() => handlePagination(num)}
                            >
                                <a className="page-link" href="#">{num}</a>
                            </li>
                        ))
                    }
                    {
                        page < total &&
                            <li className="page-item" onClick={() => handlePagination(page + 1)}>
                                <a className="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </li>

                    }
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;